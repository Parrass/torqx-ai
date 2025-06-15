
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Skip, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import WelcomeStep from './steps/WelcomeStep';
import WorkshopSetupStep from './steps/WorkshopSetupStep';
import TeamSetupStep from './steps/TeamSetupStep';
import FirstCustomerStep from './steps/FirstCustomerStep';
import FirstVehicleStep from './steps/FirstVehicleStep';
import FirstServiceOrderStep from './steps/FirstServiceOrderStep';
import PlatformTourStep from './steps/PlatformTourStep';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { progress, currentStep, steps, completeStep, skipStep, goToStep } = useOnboarding();

  if (!isOpen || !progress || !currentStep) return null;

  const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);
  const isLastStep = currentStepIndex === steps.length - 1;
  const canGoBack = currentStepIndex > 0;
  const canSkip = currentStep.isOptional;

  const handleNext = () => {
    completeStep(currentStep.id);
  };

  const handleSkip = () => {
    skipStep(currentStep.id);
  };

  const handleBack = () => {
    if (canGoBack) {
      const prevStep = steps[currentStepIndex - 1];
      goToStep(prevStep.id);
    }
  };

  const renderStepComponent = () => {
    const stepProps = {
      onNext: handleNext,
      onSkip: canSkip ? handleSkip : undefined
    };

    switch (currentStep.component) {
      case 'WelcomeStep':
        return <WelcomeStep {...stepProps} />;
      case 'WorkshopSetupStep':
        return <WorkshopSetupStep {...stepProps} />;
      case 'TeamSetupStep':
        return <TeamSetupStep {...stepProps} />;
      case 'FirstCustomerStep':
        return <FirstCustomerStep {...stepProps} />;
      case 'FirstVehicleStep':
        return <FirstVehicleStep {...stepProps} />;
      case 'FirstServiceOrderStep':
        return <FirstServiceOrderStep {...stepProps} />;
      case 'PlatformTourStep':
        return <PlatformTourStep {...stepProps} />;
      default:
        return <div>Componente não encontrado</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-torqx-primary font-satoshi">
                Configuração Inicial
              </h2>
              <p className="text-sm text-gray-600">
                Passo {currentStepIndex + 1} de {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStep.title}
            </span>
            <span className="text-sm text-gray-500">
              {progress.progress}% concluído
            </span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderStepComponent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={!canGoBack}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>

          <div className="flex items-center space-x-3">
            {canSkip && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex items-center space-x-2"
              >
                <Skip className="w-4 h-4" />
                <span>Pular</span>
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalizar</span>
                </>
              ) : (
                <>
                  <span>Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
