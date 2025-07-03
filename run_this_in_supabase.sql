-- ===== MILFORD SOUND SEO MIGRATION =====
-- Copy and paste this entire script into your Supabase SQL Editor
-- This will add all SEO fields to your database

-- 1. Add SEO fields to experiences table
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS robots_index BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS robots_nosnippet BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS og_image_alt TEXT,
ADD COLUMN IF NOT EXISTS twitter_title TEXT,
ADD COLUMN IF NOT EXISTS twitter_description TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image_alt TEXT,
ADD COLUMN IF NOT EXISTS structured_data_type TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Add SEO fields to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS robots_index BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS robots_nosnippet BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS og_image_alt TEXT,
ADD COLUMN IF NOT EXISTS twitter_title TEXT,
ADD COLUMN IF NOT EXISTS twitter_description TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image_alt TEXT,
ADD COLUMN IF NOT EXISTS structured_data_type TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Create indexes for SEO performance
CREATE INDEX IF NOT EXISTS idx_experiences_seo_title ON experiences(seo_title);
CREATE INDEX IF NOT EXISTS idx_experiences_focus_keyword ON experiences(focus_keyword);
CREATE INDEX IF NOT EXISTS idx_experiences_robots_index ON experiences(robots_index);
CREATE INDEX IF NOT EXISTS idx_experiences_updated_at ON experiences(updated_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_seo_title ON blog_posts(seo_title);
CREATE INDEX IF NOT EXISTS idx_blog_posts_focus_keyword ON blog_posts(focus_keyword);
CREATE INDEX IF NOT EXISTS idx_blog_posts_robots_index ON blog_posts(robots_index);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON blog_posts(updated_at);

-- 4. Create or replace function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 6. Add helpful comments for documentation
COMMENT ON COLUMN experiences.seo_title IS 'SEO optimized page title (50-60 characters recommended)';
COMMENT ON COLUMN experiences.seo_description IS 'Meta description for search engines (120-160 characters recommended)';
COMMENT ON COLUMN experiences.seo_keywords IS 'Comma-separated keywords for internal use';
COMMENT ON COLUMN experiences.canonical_url IS 'Canonical URL to prevent duplicate content issues';
COMMENT ON COLUMN experiences.robots_index IS 'Whether search engines should index this page';
COMMENT ON COLUMN experiences.robots_follow IS 'Whether search engines should follow links on this page';
COMMENT ON COLUMN experiences.focus_keyword IS 'Primary keyword this page should rank for';
COMMENT ON COLUMN experiences.structured_data_type IS 'Schema.org type for structured data (e.g., Product, Event)';
COMMENT ON COLUMN experiences.updated_at IS 'Last modified timestamp for SEO purposes';

COMMENT ON COLUMN blog_posts.seo_keywords IS 'Comma-separated keywords for internal use';
COMMENT ON COLUMN blog_posts.canonical_url IS 'Canonical URL to prevent duplicate content issues';
COMMENT ON COLUMN blog_posts.robots_index IS 'Whether search engines should index this page';
COMMENT ON COLUMN blog_posts.robots_follow IS 'Whether search engines should follow links on this page';
COMMENT ON COLUMN blog_posts.focus_keyword IS 'Primary keyword this page should rank for';
COMMENT ON COLUMN blog_posts.structured_data_type IS 'Schema.org type for structured data (e.g., Article, BlogPosting)';
COMMENT ON COLUMN blog_posts.updated_at IS 'Last modified timestamp for SEO purposes';

-- 7. Optional: Update existing records with default SEO values
-- Uncomment these lines if you want to populate existing records
/*
UPDATE experiences SET 
  seo_title = title,
  seo_description = SUBSTRING(description, 1, 160),
  robots_index = true,
  robots_follow = true,
  robots_nosnippet = false,
  updated_at = NOW()
WHERE seo_title IS NULL;

UPDATE blog_posts SET 
  robots_index = true,
  robots_follow = true,
  robots_nosnippet = false,
  updated_at = NOW()
WHERE robots_index IS NULL;
*/

-- Migration completed successfully!
SELECT 'SEO migration completed! All tables now have SEO fields.' as status;