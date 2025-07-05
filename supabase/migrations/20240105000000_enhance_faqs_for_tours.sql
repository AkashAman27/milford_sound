-- Migration to enhance FAQs table for tour-specific functionality

-- Add experience_id field to FAQs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'faqs' 
        AND column_name = 'experience_id'
    ) THEN
        ALTER TABLE faqs 
        ADD COLUMN experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add show_on_tour_page field to control which FAQs appear on individual tour pages
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'faqs' 
        AND column_name = 'show_on_tour_page'
    ) THEN
        ALTER TABLE faqs 
        ADD COLUMN show_on_tour_page BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add category field to organize FAQs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'faqs' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE faqs 
        ADD COLUMN category VARCHAR(100) DEFAULT 'general';
    END IF;
END $$;

-- Create an index for better performance when querying tour-specific FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_experience_id ON faqs(experience_id) WHERE experience_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_faqs_show_on_tour_page ON faqs(show_on_tour_page) WHERE show_on_tour_page = true;

-- Update existing FAQs to have proper categories
UPDATE faqs SET category = 'general' WHERE category IS NULL OR category = '';

-- Insert some tour-specific sample FAQs
INSERT INTO faqs (question, answer, category, show_on_tour_page, sort_order, enabled) VALUES
('What is included in the tour price?', 'Our tour prices include professional guide services, all entrance fees, transportation during the tour, and light refreshments. Additional meals and personal expenses are not included unless specifically mentioned.', 'pricing', true, 1, true),
('What is the minimum/maximum group size?', 'We operate with a minimum of 2 passengers and maximum of 25 passengers per tour. Private tours can be arranged for smaller or larger groups upon request.', 'booking', true, 2, true),
('What happens if the weather is bad?', 'Safety is our top priority. If weather conditions are unsafe, we will reschedule your tour at no additional cost or provide a full refund. We monitor weather conditions closely and will contact you if changes are needed.', 'weather', true, 3, true),
('Is this tour suitable for people with mobility issues?', 'Please check the specific accessibility information on each tour page. We strive to accommodate all guests and offer modified experiences where possible. Contact us directly to discuss your specific needs.', 'accessibility', true, 4, true),
('Can I bring my camera/phone?', 'Absolutely! We encourage you to capture your memories. Please be mindful of safety instructions from your guide, especially in areas where secure footing is important.', 'general', true, 5, true)
ON CONFLICT DO NOTHING;