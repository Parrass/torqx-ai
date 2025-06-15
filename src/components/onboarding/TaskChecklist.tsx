
import React from 'react';
import { CheckCircle, Circle, ExternalLink, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';

const TaskChecklist: React.FC = () => {
  const { tasks, completeTask } = useOnboarding();
  const navigate = useNavigate();

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;

  const handleTaskClick = (task: any) => {
    if (!task.isCompleted && task.action.startsWith('/')) {
      navigate(task.action);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup':
        return '⚙️';
      case 'first-use':
        return '🚀';
      case 'learning':
        return '📚';
      default:
        return '✅';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-torqx-primary font-satoshi">
            Lista de Tarefas
          </h2>
          <p className="text-gray-600">
            Complete estas tarefas para aproveitar todo o potencial do Torqx
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-torqx-secondary">
            {completedTasks}/{totalTasks}
          </div>
          <div className="text-sm text-gray-500">concluídas</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progresso</span>
          <span className="text-torqx-secondary font-medium">
            {Math.round((completedTasks / totalTasks) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-torqx-secondary to-torqx-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
              task.isCompleted
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex-shrink-0">
              {task.isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(task.category)}</span>
                <h3 className={`font-medium ${
                  task.isCompleted ? 'text-green-800' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.reward && task.isCompleted && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {task.reward}
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                task.isCompleted ? 'text-green-600' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            </div>
            
            {!task.isCompleted && task.action.startsWith('/') && (
              <ExternalLink className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Completion Reward */}
      {completedTasks === totalTasks && (
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="font-semibold text-yellow-800 mb-1">
            Parabéns! Todas as tarefas concluídas!
          </h3>
          <p className="text-sm text-yellow-700">
            Você está pronto para usar todo o potencial do Torqx! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskChecklist;
