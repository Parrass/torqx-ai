
-- Criar tabela para progresso do onboarding
CREATE TABLE public.onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    current_step VARCHAR(50) NOT NULL,
    completed_steps TEXT[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para tarefas do onboarding
CREATE TABLE public.onboarding_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    task_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action VARCHAR(255),
    category VARCHAR(50) DEFAULT 'setup',
    reward VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Habilitar RLS
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para onboarding_progress
CREATE POLICY "Users can view their own onboarding progress" 
    ON public.onboarding_progress 
    FOR SELECT 
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own onboarding progress" 
    ON public.onboarding_progress 
    FOR INSERT 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding progress" 
    ON public.onboarding_progress 
    FOR UPDATE 
    USING (user_id = auth.uid());

-- Políticas para onboarding_tasks
CREATE POLICY "Users can view their own onboarding tasks" 
    ON public.onboarding_tasks 
    FOR SELECT 
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own onboarding tasks" 
    ON public.onboarding_tasks 
    FOR INSERT 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding tasks" 
    ON public.onboarding_tasks 
    FOR UPDATE 
    USING (user_id = auth.uid());

-- Triggers para atualizar updated_at
CREATE TRIGGER update_onboarding_progress_updated_at
    BEFORE UPDATE ON public.onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_tasks_updated_at
    BEFORE UPDATE ON public.onboarding_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
