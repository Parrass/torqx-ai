
import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';

const OnboardingProgressBar: React.FC = () => {
  const { progress, steps, currentStep } = useOnboarding();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!progress || !currentStep) return null;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getCurrentStepDisplay = () => {
    const step = currentStep;
    const isCompleted = step.isCompleted;
    const isCurrent = true;

    return (
      <div
        key={step.id}
        className="flex items-center space-x-3 p-3 rounded-lg transition-all bg-torqx-secondary/10 border border-torqx-secondary/20"
      >
        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <div className="w-5 h-5 border-2 border-torqx-secondary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-torqx-secondary rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-torqx-secondary">
            {step.title}
          </h4>
          <p className="text-sm text-torqx-secondary/80">
            {step.description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <span className="text-xs bg-torqx-secondary text-white px-2 py-1 rounded-full">
            Atual
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={toggleExpansion}
      >
        <h3 className="text-lg font-semibold text-torqx-primary font-satoshi">
          Configuração da Oficina
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {progress.progress}% concluído
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress.progress} className="h-3" />
      </div>

      {/* Current Step (always visible) */}
      <div className="space-y-3">
        {getCurrentStepDisplay()}
      </div>

      {/* All Steps (expanded view) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = step.isCompleted;
              const isCurrent = step.id === currentStep.id;
              const isPast = index < currentStepIndex;

              // Skip current step since it's already shown above
              if (isCurrent) return null;

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isCompleted
                        ? 'text-green-800'
                        : 'text-gray-700'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {step.isOptional && !isCompleted && (
                    <div className="flex-shrink-0">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Opcional
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!progress.isCompleted && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            Próximo passo: <span className="font-medium text-torqx-primary">{currentStep.title}</span>
          </div>
          <div className="text-xs text-gray-500">
            {progress.completedSteps.length} de {steps.length} etapas concluídas
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingProgressBar;
