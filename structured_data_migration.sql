-- Add structured data fields to existing tables
-- This migration adds JSON-LD override capabilities to key content tables

-- Add structured data fields to experiences table
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS structured_data_type VARCHAR(50) DEFAULT 'TouristAttraction',
ADD COLUMN IF NOT EXISTS custom_json_ld TEXT,
ADD COLUMN IF NOT EXISTS structured_data_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS schema_override_priority INTEGER DEFAULT 0;

-- Add structured data fields to blog_posts table  
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS structured_data_type VARCHAR(50) DEFAULT 'BlogPosting',
ADD COLUMN IF NOT EXISTS custom_json_ld TEXT,
ADD COLUMN IF NOT EXISTS structured_data_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS schema_override_priority INTEGER DEFAULT 0;

-- Add structured data fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS structured_data_type VARCHAR(50) DEFAULT 'Service',
ADD COLUMN IF NOT EXISTS custom_json_ld TEXT,
ADD COLUMN IF NOT EXISTS structured_data_enabled BOOLEAN DEFAULT true;

-- Add structured data fields to subcategories table
ALTER TABLE subcategories  
ADD COLUMN IF NOT EXISTS structured_data_type VARCHAR(50) DEFAULT 'Service',
ADD COLUMN IF NOT EXISTS custom_json_ld TEXT,
ADD COLUMN IF NOT EXISTS structured_data_enabled BOOLEAN DEFAULT true;

-- Create a global structured data settings table
CREATE TABLE IF NOT EXISTS structured_data_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    schema_type VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default global structured data settings
INSERT INTO structured_data_settings (setting_key, setting_value, schema_type, description) VALUES
('organization_schema', '{"@context":"https://schema.org","@type":"Organization","name":"Milford Sound Tours","url":"https://milford-sound.com","description":"Premier tour operator offering unforgettable experiences in Milford Sound, New Zealand"}', 'Organization', 'Main organization schema for the website'),
('website_schema', '{"@context":"https://schema.org","@type":"WebSite","name":"Milford Sound Tours","url":"https://milford-sound.com","description":"Discover amazing tours and experiences in Milford Sound, New Zealand"}', 'WebSite', 'Website schema for the homepage'),
('local_business_schema', '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Milford Sound Tours","address":{"@type":"PostalAddress","addressLocality":"Milford Sound","addressRegion":"Southland","addressCountry":"NZ"}}', 'LocalBusiness', 'Local business information'),
('default_breadcrumb_schema', '{"@context":"https://schema.org","@type":"BreadcrumbList"}', 'BreadcrumbList', 'Default breadcrumb structure'),
('faq_schema_template', '{"@context":"https://schema.org","@type":"FAQPage"}', 'FAQPage', 'FAQ page schema template')
ON CONFLICT (setting_key) DO NOTHING;

-- Create structured data override log table for tracking changes
CREATE TABLE IF NOT EXISTS structured_data_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_json_ld TEXT,
    new_json_ld TEXT,
    change_type VARCHAR(20) NOT NULL, -- 'created', 'updated', 'deleted'
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validation_status VARCHAR(20) DEFAULT 'pending', -- 'valid', 'invalid', 'pending'
    validation_errors TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experiences_structured_data ON experiences(structured_data_enabled, structured_data_type);
CREATE INDEX IF NOT EXISTS idx_blog_posts_structured_data ON blog_posts(structured_data_enabled, structured_data_type);
CREATE INDEX IF NOT EXISTS idx_structured_data_logs_table_record ON structured_data_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_structured_data_settings_key ON structured_data_settings(setting_key);

-- Add comments for documentation
COMMENT ON COLUMN experiences.structured_data_type IS 'Schema.org type for automatic structured data generation';
COMMENT ON COLUMN experiences.custom_json_ld IS 'Custom JSON-LD that overrides automatic generation';
COMMENT ON COLUMN experiences.structured_data_enabled IS 'Whether to include structured data for this experience';
COMMENT ON COLUMN experiences.schema_override_priority IS 'Priority level for schema selection (higher = preferred)';

COMMENT ON COLUMN blog_posts.structured_data_type IS 'Schema.org type for automatic structured data generation';
COMMENT ON COLUMN blog_posts.custom_json_ld IS 'Custom JSON-LD that overrides automatic generation';
COMMENT ON COLUMN blog_posts.structured_data_enabled IS 'Whether to include structured data for this blog post';
COMMENT ON COLUMN blog_posts.schema_override_priority IS 'Priority level for schema selection (higher = preferred)';

COMMENT ON TABLE structured_data_settings IS 'Global structured data configurations and templates';
COMMENT ON TABLE structured_data_logs IS 'Audit log for structured data changes and validation';

-- Create a function to validate JSON-LD before saving
CREATE OR REPLACE FUNCTION validate_json_ld()
RETURNS TRIGGER AS $$
BEGIN
    -- Only validate if custom_json_ld is not null and not empty
    IF NEW.custom_json_ld IS NOT NULL AND NEW.custom_json_ld != '' THEN
        -- Try to parse JSON
        BEGIN
            PERFORM NEW.custom_json_ld::json;
        EXCEPTION WHEN invalid_text_representation THEN
            RAISE EXCEPTION 'Invalid JSON in custom_json_ld: %', NEW.custom_json_ld;
        END;
        
        -- Check for required @context and @type
        IF NOT (NEW.custom_json_ld::json ? '@context') THEN
            RAISE EXCEPTION 'JSON-LD must contain @context property';
        END IF;
        
        IF NOT (NEW.custom_json_ld::json ? '@type') THEN
            RAISE EXCEPTION 'JSON-LD must contain @type property';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger to relevant tables
DROP TRIGGER IF EXISTS validate_experiences_json_ld ON experiences;
CREATE TRIGGER validate_experiences_json_ld
    BEFORE INSERT OR UPDATE ON experiences
    FOR EACH ROW
    WHEN (NEW.custom_json_ld IS NOT NULL)
    EXECUTE FUNCTION validate_json_ld();

DROP TRIGGER IF EXISTS validate_blog_posts_json_ld ON blog_posts;
CREATE TRIGGER validate_blog_posts_json_ld
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW
    WHEN (NEW.custom_json_ld IS NOT NULL)
    EXECUTE FUNCTION validate_json_ld();

-- Create audit trigger for structured data changes
CREATE OR REPLACE FUNCTION log_structured_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO structured_data_logs (table_name, record_id, new_json_ld, change_type)
        VALUES (TG_TABLE_NAME, NEW.id, NEW.custom_json_ld, 'created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.custom_json_ld IS DISTINCT FROM NEW.custom_json_ld THEN
            INSERT INTO structured_data_logs (table_name, record_id, old_json_ld, new_json_ld, change_type)
            VALUES (TG_TABLE_NAME, NEW.id, OLD.custom_json_ld, NEW.custom_json_ld, 'updated');
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO structured_data_logs (table_name, record_id, old_json_ld, change_type)
        VALUES (TG_TABLE_NAME, OLD.id, OLD.custom_json_ld, 'deleted');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers
DROP TRIGGER IF EXISTS audit_experiences_structured_data ON experiences;
CREATE TRIGGER audit_experiences_structured_data
    AFTER INSERT OR UPDATE OR DELETE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION log_structured_data_changes();

DROP TRIGGER IF EXISTS audit_blog_posts_structured_data ON blog_posts;
CREATE TRIGGER audit_blog_posts_structured_data
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION log_structured_data_changes();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON structured_data_settings TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON structured_data_logs TO authenticated;