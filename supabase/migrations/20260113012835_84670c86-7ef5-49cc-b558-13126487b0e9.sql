-- Create custom_categories table
CREATE TABLE public.custom_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  color TEXT DEFAULT 'bg-muted text-muted-foreground',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_categories
CREATE POLICY "Users can view their own categories"
ON public.custom_categories
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
ON public.custom_categories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
ON public.custom_categories
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
ON public.custom_categories
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_custom_categories_updated_at
BEFORE UPDATE ON public.custom_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create quick_access_documents table
CREATE TABLE public.quick_access_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, document_id)
);

-- Enable RLS
ALTER TABLE public.quick_access_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for quick_access_documents
CREATE POLICY "Users can view their own quick access"
ON public.quick_access_documents
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quick access"
ON public.quick_access_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick access"
ON public.quick_access_documents
FOR DELETE
USING (auth.uid() = user_id);