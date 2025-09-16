-- Create rate_limit_attempts table for authentication rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL,
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_rate_limit_attempts_key_created_at 
    ON public.rate_limit_attempts (key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rate_limit_attempts_identifier_action 
    ON public.rate_limit_attempts (identifier, action);

CREATE INDEX IF NOT EXISTS idx_rate_limit_attempts_created_at 
    ON public.rate_limit_attempts (created_at);

-- Enable Row Level Security
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage rate limit data
CREATE POLICY "Service role can manage rate limit attempts" 
    ON public.rate_limit_attempts 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- Create policy for authenticated users to read their own attempts (optional)
CREATE POLICY "Users can view their own rate limit attempts" 
    ON public.rate_limit_attempts 
    FOR SELECT 
    TO authenticated 
    USING (identifier = auth.uid()::text);

-- Add comment for documentation
COMMENT ON TABLE public.rate_limit_attempts IS 'Stores rate limiting attempts for authentication and security';
COMMENT ON COLUMN public.rate_limit_attempts.key IS 'Composite key: action:identifier';
COMMENT ON COLUMN public.rate_limit_attempts.identifier IS 'User identifier (email, IP, user_id, etc.)';
COMMENT ON COLUMN public.rate_limit_attempts.action IS 'Action being rate limited (login, signup, etc.)';
COMMENT ON COLUMN public.rate_limit_attempts.success IS 'Whether the attempt was successful';
COMMENT ON COLUMN public.rate_limit_attempts.metadata IS 'Additional metadata about the attempt';