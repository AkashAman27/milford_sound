-- Migration to create FAQ table and homepage settings for new sections

-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for enabled FAQs
CREATE POLICY "Allow public read access for enabled FAQs" ON faqs
    FOR SELECT USING (enabled = true);

-- Allow authenticated users full access (for admin)
CREATE POLICY "Allow full access for authenticated users" ON faqs
    FOR ALL USING (auth.role() = 'authenticated');

-- Modify internal_links_sections to support homepage context
-- Add context_type and context_id columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'internal_links_sections' 
        AND column_name = 'context_type'
    ) THEN
        ALTER TABLE internal_links_sections 
        ADD COLUMN context_type VARCHAR(50) DEFAULT 'experience';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'internal_links_sections' 
        AND column_name = 'context_id'
    ) THEN
        ALTER TABLE internal_links_sections 
        ADD COLUMN context_id UUID;
    END IF;
END $$;

-- Update existing records to use experience context type
UPDATE internal_links_sections 
SET context_type = 'experience', 
    context_id = experience_id 
WHERE context_type IS NULL OR context_type = '';

-- Insert homepage settings for FAQ and internal links sections if they don't exist
INSERT INTO homepage_settings (section_name, title, subtitle, description, button_text, button_link, enabled, sort_order)
VALUES 
    ('faq_section', 'Frequently Asked Questions', '', 'Find answers to common questions about our experiences and services', '', '', true, 5),
    ('internal_links_section', 'Explore More', '', 'Discover everything we have to offer', '', '', true, 6)
ON CONFLICT (section_name) DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (question, answer, sort_order, enabled) VALUES
('How do I book an experience?', 'You can book any experience by clicking the "Book Now" button on the experience page. You''ll be guided through our secure booking process where you can select your preferred date and time.', 1, true),
('What is your cancellation policy?', 'We offer free cancellation up to 24 hours before your experience starts. For experiences cancelled within 24 hours, a 50% refund will be provided. Weather-related cancellations are fully refunded.', 2, true),
('Are experiences suitable for children?', 'Many of our experiences are family-friendly and suitable for children. Each experience page includes age recommendations and any restrictions. Please check the specific requirements before booking.', 3, true),
('What should I bring on the day?', 'Each experience has specific requirements listed on its detail page. Generally, we recommend comfortable clothing, weather-appropriate gear, and bringing water. Specific equipment requirements will be mentioned in your booking confirmation.', 4, true),
('Do you offer group discounts?', 'Yes! We offer special rates for groups of 8 or more people. Contact our customer service team to discuss group bookings and receive a customized quote for your group.', 5, true)
ON CONFLICT DO NOTHING;

-- Create sample homepage internal link sections
DO $$
DECLARE
    section_id UUID;
BEGIN
    -- Insert Popular Destinations section
    INSERT INTO internal_links_sections (title, type, sort_order, enabled, context_type, context_id)
    VALUES ('Popular Destinations', 'destinations', 1, true, 'homepage', null)
    RETURNING id INTO section_id;
    
    -- Insert links for Popular Destinations
    INSERT INTO internal_links (section_id, title, url, display_order, enabled) VALUES
    (section_id, 'Milford Sound Cruises', '/destination/milford-sound', 1, true),
    (section_id, 'Queenstown Adventures', '/destination/queenstown', 2, true),
    (section_id, 'Fiordland National Park', '/destination/fiordland', 3, true),
    (section_id, 'Southern Alps Tours', '/destination/southern-alps', 4, true);
    
    -- Insert Top Experiences section
    INSERT INTO internal_links_sections (title, type, sort_order, enabled, context_type, context_id)
    VALUES ('Top Experiences', 'experiences', 2, true, 'homepage', null)
    RETURNING id INTO section_id;
    
    -- Insert links for Top Experiences
    INSERT INTO internal_links (section_id, title, url, display_order, enabled) VALUES
    (section_id, 'Boat Cruises', '/category/boat-cruises', 1, true),
    (section_id, 'Scenic Flights', '/category/scenic-flights', 2, true),
    (section_id, 'Walking & Hiking', '/category/walking-hiking', 3, true),
    (section_id, 'Food & Drink Experiences', '/category/food-drink-experiences', 4, true);
    
    -- Insert Travel Information section
    INSERT INTO internal_links_sections (title, type, sort_order, enabled, context_type, context_id)
    VALUES ('Travel Information', 'information', 3, true, 'homepage', null)
    RETURNING id INTO section_id;
    
    -- Insert links for Travel Information
    INSERT INTO internal_links (section_id, title, url, display_order, enabled) VALUES
    (section_id, 'Planning Your Trip', '/help/planning', 1, true),
    (section_id, 'Weather Information', '/help/weather', 2, true),
    (section_id, 'What to Pack', '/help/packing', 3, true),
    (section_id, 'Getting Around', '/help/transport', 4, true),
    (section_id, 'Contact Us', '/contact', 5, true);
    
EXCEPTION
    WHEN others THEN
        -- If sections already exist, just continue
        NULL;
END $$;