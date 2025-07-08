-- Create robots_config table for managing robots.txt content
CREATE TABLE IF NOT EXISTS robots_config (
  id SERIAL PRIMARY KEY,
  user_agent TEXT NOT NULL DEFAULT '*',
  allow_paths TEXT[] DEFAULT ARRAY['/'],
  disallow_paths TEXT[] DEFAULT ARRAY['/admin', '/api', '/auth/callback', '/checkout', '/_next', '/dev-output.log'],
  sitemap_url TEXT DEFAULT 'https://tps-site.com/sitemap.xml',
  additional_rules TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO robots_config (user_agent, allow_paths, disallow_paths, sitemap_url) 
VALUES (
  '*',
  ARRAY['/'],
  ARRAY['/admin', '/api', '/auth/callback', '/checkout', '/_next', '/dev-output.log'],
  'https://tps-site.com/sitemap.xml'
) ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_robots_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER robots_config_updated_at
  BEFORE UPDATE ON robots_config
  FOR EACH ROW
  EXECUTE FUNCTION update_robots_config_updated_at();