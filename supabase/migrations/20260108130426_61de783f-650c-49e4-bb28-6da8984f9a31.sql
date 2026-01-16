-- 1. Add DELETE policy for aima_processes (GDPR compliance)
CREATE POLICY "Users can delete their own AIMA process"
ON public.aima_processes FOR DELETE
USING (auth.uid() = user_id);

-- 2. Update handle_new_user function with validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Validate that NEW.id is a valid UUID
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'Invalid user ID: cannot be null';
  END IF;
  
  -- Check if profile already exists to prevent duplicates
  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
    RETURN NEW;
  END IF;
  
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;