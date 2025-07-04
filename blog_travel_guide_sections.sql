-- Create blog guide sections table
CREATE TABLE IF NOT EXISTS blog_guide_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    section_title VARCHAR(255) NOT NULL,
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN ('what_to_do', 'what_not_to_do', 'what_to_carry', 'custom')),
    content TEXT,
    enabled BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog guide items table
CREATE TABLE IF NOT EXISTS blog_guide_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES blog_guide_sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'check',
    importance VARCHAR(20) DEFAULT 'recommended' CHECK (importance IN ('essential', 'recommended', 'optional')),
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_guide_sections_blog_post_id ON blog_guide_sections(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_guide_sections_enabled ON blog_guide_sections(enabled);
CREATE INDEX IF NOT EXISTS idx_blog_guide_sections_sort_order ON blog_guide_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_guide_items_section_id ON blog_guide_items(section_id);
CREATE INDEX IF NOT EXISTS idx_blog_guide_items_importance ON blog_guide_items(importance);

-- Create updated_at trigger for blog_guide_sections
CREATE OR REPLACE FUNCTION update_blog_guide_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_guide_sections_updated_at ON blog_guide_sections;
CREATE TRIGGER update_blog_guide_sections_updated_at
    BEFORE UPDATE ON blog_guide_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_guide_sections_updated_at();

-- Create updated_at trigger for blog_guide_items
CREATE OR REPLACE FUNCTION update_blog_guide_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_guide_items_updated_at ON blog_guide_items;
CREATE TRIGGER update_blog_guide_items_updated_at
    BEFORE UPDATE ON blog_guide_items
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_guide_items_updated_at();

-- Insert sample travel guide data for the Paris blog post (assuming it exists)
-- You'll need to replace the blog_post_id with the actual UUID from your blog_posts table
INSERT INTO blog_guide_sections (blog_post_id, section_title, section_type, content, sort_order) VALUES
-- Replace 'your-blog-post-uuid-here' with actual blog post UUID
-- ('your-blog-post-uuid-here', 'Must-Do Experiences', 'what_to_do', 'Paris offers countless incredible experiences. Here are the absolute must-dos that will make your trip unforgettable. From iconic landmarks to hidden local gems, these activities capture the true essence of the City of Light.', 1),
-- ('your-blog-post-uuid-here', 'Things to Avoid', 'what_not_to_do', 'While Paris is generally safe and welcoming, there are some common tourist traps and mistakes that can dampen your experience. Being aware of these will help you have a smoother, more authentic trip.', 2),
-- ('your-blog-post-uuid-here', 'Essential Packing List', 'what_to_carry', 'Packing smart for Paris depends on the season and your planned activities. Here''s what you need to bring for a comfortable and prepared trip to the French capital.', 3);

-- Sample guide items (uncomment and update blog_post_id when ready)
-- INSERT INTO blog_guide_items (section_id, title, description, icon, importance, category, sort_order) VALUES
-- First, get the section IDs from the sections you just created, then insert items like:
-- (section_id, 'Visit the Eiffel Tower at Sunset', 'Experience the magic of Paris''s most iconic landmark during golden hour when the lighting is perfect and crowds are smaller.', 'camera', 'essential', 'Sightseeing', 1),
-- (section_id, 'Stroll through Montmartre', 'Explore the artistic heart of Paris with its cobblestone streets, street artists, and the beautiful Sacré-Cœur Basilica.', 'map', 'recommended', 'Culture', 2);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_guide_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
DROP POLICY IF EXISTS "Allow public read access to blog guide sections" ON blog_guide_sections;
CREATE POLICY "Allow public read access to blog guide sections"
    ON blog_guide_sections FOR SELECT
    USING (enabled = true);

DROP POLICY IF EXISTS "Allow public read access to blog guide items" ON blog_guide_items;
CREATE POLICY "Allow public read access to blog guide items"
    ON blog_guide_items FOR SELECT
    USING (true);

-- Admin policies (you may need to adjust based on your auth setup)
DROP POLICY IF EXISTS "Allow admin full access to blog guide sections" ON blog_guide_sections;
CREATE POLICY "Allow admin full access to blog guide sections"
    ON blog_guide_sections FOR ALL
    USING (true);

DROP POLICY IF EXISTS "Allow admin full access to blog guide items" ON blog_guide_items;
CREATE POLICY "Allow admin full access to blog guide items"
    ON blog_guide_items FOR ALL
    USING (true);