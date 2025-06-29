-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Tours & Attractions', 'tours-attractions', 'Discover the best tours and attractions in your destination', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'),
('Museums & Galleries', 'museums-galleries', 'Explore world-class museums and art galleries', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'),
('Food & Drinks', 'food-drinks', 'Taste local cuisine and experience culinary tours', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'),
('Adventure & Outdoor', 'adventure-outdoor', 'Thrilling outdoor activities and adventures', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'),
('Shows & Entertainment', 'shows-entertainment', 'Live shows, concerts, and entertainment experiences', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'),
('Day Trips', 'day-trips', 'Full-day excursions and guided tours', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400');

-- Insert sample cities
INSERT INTO public.cities (name, slug, country, description, image_url, featured) VALUES
('New York', 'new-york', 'United States', 'The city that never sleeps', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', true),
('Paris', 'paris', 'France', 'The city of lights and romance', 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600', true),
('London', 'london', 'United Kingdom', 'A blend of history and modernity', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', true),
('Tokyo', 'tokyo', 'Japan', 'Where tradition meets innovation', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', true),
('Barcelona', 'barcelona', 'Spain', 'Mediterranean charm and Gaudí architecture', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600', true),
('Rome', 'rome', 'Italy', 'The eternal city of ancient wonders', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', true),
('Dubai', 'dubai', 'UAE', 'Modern marvels and luxury experiences', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', false),
('Amsterdam', 'amsterdam', 'Netherlands', 'Canals, culture, and creativity', 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600', false);

-- Insert sample products
INSERT INTO public.products (title, slug, description, short_description, price, city_id, category_id, image_url, gallery_images, duration, max_group_size, featured, rating, review_count) VALUES
('Statue of Liberty & Ellis Island Tour', 'statue-of-liberty-ellis-island-tour', 'Experience the iconic symbols of freedom and immigration with this comprehensive tour of the Statue of Liberty and Ellis Island. Learn about the history that shaped America while enjoying stunning views of New York Harbor.', 'Visit the Statue of Liberty and Ellis Island with skip-the-line access', 45.00, 
    (SELECT id FROM public.cities WHERE slug = 'new-york'), 
    (SELECT id FROM public.categories WHERE slug = 'tours-attractions'), 
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=600'],
    '4 hours', 25, true, 4.5, 1250),

('Louvre Museum Priority Access', 'louvre-museum-priority-access', 'Skip the lines and explore the world''s largest art museum with priority access to the Louvre. Discover masterpieces including the Mona Lisa, Venus de Milo, and thousands of other treasures.', 'Skip-the-line access to the Louvre Museum', 25.00,
    (SELECT id FROM public.cities WHERE slug = 'paris'), 
    (SELECT id FROM public.categories WHERE slug = 'museums-galleries'), 
    'https://images.unsplash.com/photo-1566139992169-9a8b0c9e0b58?w=600',
    ARRAY['https://images.unsplash.com/photo-1566139992169-9a8b0c9e0b58?w=600', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'],
    '3 hours', 20, true, 4.3, 2100),

('Tower of London & Crown Jewels', 'tower-of-london-crown-jewels', 'Discover 1000 years of history at the Tower of London, home to the Crown Jewels. Meet the famous Yeoman Warders (Beefeaters) and hear tales of intrigue, imprisonment, and execution.', 'Explore the Tower of London and see the Crown Jewels', 32.00,
    (SELECT id FROM public.cities WHERE slug = 'london'), 
    (SELECT id FROM public.categories WHERE slug = 'tours-attractions'), 
    'https://images.unsplash.com/photo-1587133603991-8e845d4b2fb0?w=600',
    ARRAY['https://images.unsplash.com/photo-1587133603991-8e845d4b2fb0?w=600', 'https://images.unsplash.com/photo-1586137735023-5d6b3d1e3e1f?w=600'],
    '2.5 hours', 15, true, 4.7, 1800),

('Tokyo Food Tour in Shibuya', 'tokyo-food-tour-shibuya', 'Embark on a culinary adventure through Tokyo''s bustling Shibuya district. Taste authentic Japanese street food, visit local markets, and learn about Japanese food culture from expert guides.', 'Authentic Japanese food tour in Shibuya district', 75.00,
    (SELECT id FROM public.cities WHERE slug = 'tokyo'), 
    (SELECT id FROM public.categories WHERE slug = 'food-drinks'), 
    'https://images.unsplash.com/photo-1576866209830-589e1bfbaa8d?w=600',
    ARRAY['https://images.unsplash.com/photo-1576866209830-589e1bfbaa8d?w=600', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600'],
    '3.5 hours', 8, true, 4.8, 920),

('Sagrada Família Skip-the-Line', 'sagrada-familia-skip-the-line', 'Marvel at Gaudí''s masterpiece with skip-the-line access to the Sagrada Família. Explore this iconic basilica and learn about its fascinating history and unique architecture.', 'Skip-the-line access to Sagrada Família with audio guide', 28.00,
    (SELECT id FROM public.cities WHERE slug = 'barcelona'), 
    (SELECT id FROM public.categories WHERE slug = 'tours-attractions'), 
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
    ARRAY['https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600'],
    '1.5 hours', 30, false, 4.6, 3200),

('Colosseum Underground Tour', 'colosseum-underground-tour', 'Discover the hidden chambers beneath the Colosseum floor where gladiators once prepared for battle. This exclusive tour includes access to restricted areas and the Roman Forum.', 'Underground access to Colosseum with Roman Forum', 65.00,
    (SELECT id FROM public.cities WHERE slug = 'rome'), 
    (SELECT id FROM public.categories WHERE slug = 'tours-attractions'), 
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
    ARRAY['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600'],
    '3 hours', 12, true, 4.9, 1650);

-- Insert sample reviews
INSERT INTO public.reviews (product_id, rating, comment, user_id) VALUES
((SELECT id FROM public.products WHERE slug = 'statue-of-liberty-ellis-island-tour'), 5, 'Amazing experience! The guide was knowledgeable and the views were spectacular.', '00000000-0000-0000-0000-000000000001'),
((SELECT id FROM public.products WHERE slug = 'louvre-museum-priority-access'), 4, 'Great way to skip the lines. Saw the Mona Lisa and many other masterpieces.', '00000000-0000-0000-0000-000000000002'),
((SELECT id FROM public.products WHERE slug = 'tokyo-food-tour-shibuya'), 5, 'Incredible food tour! Tried so many authentic dishes I never would have found on my own.', '00000000-0000-0000-0000-000000000003');

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image, author_id, published) VALUES
('Top 10 Must-Visit Museums in Paris', 'top-10-museums-paris', 'Discover the most incredible museums Paris has to offer beyond the famous Louvre.', 'Paris is home to some of the world''s most prestigious museums. While the Louvre gets most of the attention, the city offers countless other cultural treasures waiting to be explored...', 'https://images.unsplash.com/photo-1566139992169-9a8b0c9e0b58?w=800', '00000000-0000-0000-0000-000000000001', true),
('The Ultimate Tokyo Food Guide', 'ultimate-tokyo-food-guide', 'Everything you need to know about eating your way through Tokyo like a local.', 'Tokyo''s food scene is legendary, offering everything from street food to Michelin-starred restaurants. Here''s your complete guide to eating like a local...', 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa8d?w=800', '00000000-0000-0000-0000-000000000002', true),
('Hidden Gems of New York City', 'hidden-gems-new-york-city', 'Discover the secret spots that even locals don''t know about in the Big Apple.', 'Beyond the famous landmarks, New York City is filled with hidden gems waiting to be discovered. From secret speakeasies to hidden gardens...', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', '00000000-0000-0000-0000-000000000003', true);