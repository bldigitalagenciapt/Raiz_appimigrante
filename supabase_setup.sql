-- ============================================
-- VOY APP - CONFIGURAÇÃO COMPLETA DO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Nova instância: https://ohqftepzfpcvvcdaosxq.supabase.co

-- ============================================
-- 1. TABELAS
-- ============================================

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'pt',
  user_profile TEXT DEFAULT 'recent',
  nif TEXT,
  niss TEXT,
  sns TEXT,
  passport TEXT,
  notifications_enabled BOOLEAN DEFAULT false,
  biometric_enabled BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'light',
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  is_important BOOLEAN DEFAULT false,
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de processos AIMA
CREATE TABLE IF NOT EXISTS public.aima_processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  process_type TEXT,
  completed_steps TEXT[] DEFAULT '{}',
  important_dates JSONB DEFAULT '[]',
  protocols TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de categorias customizadas
CREATE TABLE IF NOT EXISTS public.custom_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de documentos de acesso rápido
CREATE TABLE IF NOT EXISTS public.quick_access_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 2. HABILITAR RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aima_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_access_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. POLÍTICAS RLS - PROFILES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- 4. POLÍTICAS RLS - DOCUMENTS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
ON public.documents FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Users can insert their own documents"
ON public.documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents"
ON public.documents FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents"
ON public.documents FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 5. POLÍTICAS RLS - NOTES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
CREATE POLICY "Users can view their own notes"
ON public.notes FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
CREATE POLICY "Users can insert their own notes"
ON public.notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
CREATE POLICY "Users can update their own notes"
ON public.notes FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Users can delete their own notes"
ON public.notes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 6. POLÍTICAS RLS - AIMA PROCESSES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own AIMA process" ON public.aima_processes;
CREATE POLICY "Users can view their own AIMA process"
ON public.aima_processes FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AIMA process" ON public.aima_processes;
CREATE POLICY "Users can insert their own AIMA process"
ON public.aima_processes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AIMA process" ON public.aima_processes;
CREATE POLICY "Users can update their own AIMA process"
ON public.aima_processes FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- 7. POLÍTICAS RLS - CUSTOM CATEGORIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own categories" ON public.custom_categories;
CREATE POLICY "Users can view their own categories"
ON public.custom_categories FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own categories" ON public.custom_categories;
CREATE POLICY "Users can insert their own categories"
ON public.custom_categories FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own categories" ON public.custom_categories;
CREATE POLICY "Users can update their own categories"
ON public.custom_categories FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own categories" ON public.custom_categories;
CREATE POLICY "Users can delete their own categories"
ON public.custom_categories FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 8. POLÍTICAS RLS - QUICK ACCESS DOCUMENTS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own quick access" ON public.quick_access_documents;
CREATE POLICY "Users can view their own quick access"
ON public.quick_access_documents FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quick access" ON public.quick_access_documents;
CREATE POLICY "Users can insert their own quick access"
ON public.quick_access_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own quick access" ON public.quick_access_documents;
CREATE POLICY "Users can delete their own quick access"
ON public.quick_access_documents FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 9. FUNÇÕES E TRIGGERS
-- ============================================

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, language, user_profile)
  VALUES (NEW.id, 'pt', 'recent');
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at em todas as tabelas
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_aima_processes_updated_at ON public.aima_processes;
CREATE TRIGGER update_aima_processes_updated_at
  BEFORE UPDATE ON public.aima_processes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_categories_updated_at ON public.custom_categories;
CREATE TRIGGER update_custom_categories_updated_at
  BEFORE UPDATE ON public.custom_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 10. STORAGE BUCKET
-- ============================================

-- Criar bucket voy_secure_docs (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('voy_secure_docs', 'voy_secure_docs', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. POLÍTICAS DE STORAGE
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem ler documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus documentos" ON storage.objects;

-- Criar novas políticas para o bucket voy_secure_docs
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voy_secure_docs');

CREATE POLICY "Users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'voy_secure_docs');

CREATE POLICY "Users can delete their documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voy_secure_docs');

-- ============================================
-- FIM DA CONFIGURAÇÃO
-- ============================================

-- Verificar se tudo foi criado corretamente
SELECT 'Configuração concluída com sucesso!' as status;
