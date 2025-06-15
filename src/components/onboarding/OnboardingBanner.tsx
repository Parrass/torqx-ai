
import React from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingBannerProps {
  onOpenWizard: () => void;
  onDismiss: () => void;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onOpenWizard, onDismiss }) => {
  const { progress, tasks } = useOnboarding();

  if (!progress || progress.isCompleted) return null;

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1">
              Complete a configuração da sua oficina
            </h3>
            <p className="text-sm opacity-90 mb-2">
              Faltam apenas alguns passos para aproveitar todo o potencial do Torqx
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Progress value={progress.progress} className="h-2 bg-white/20" />
              </div>
              <span className="text-sm font-medium">
                {progress.progress}%
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm opacity-90">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>{completedTasks}/{totalTasks} tarefas</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>~5 min restantes</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenWizard}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Continuar
          </Button>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;
