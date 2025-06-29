-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories table policies (public read access)
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

-- Cities table policies (public read access)
CREATE POLICY "Anyone can view cities" ON public.cities
    FOR SELECT USING (true);

-- Products table policies (public read access)
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

-- Cart items policies (user-specific)
CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Orders table policies (user-specific)
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies (user can view through orders)
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Reviews table policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Blog posts policies (public read access for published posts)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Authors can view own blog posts" ON public.blog_posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert own blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own blog posts" ON public.blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own blog posts" ON public.blog_posts
    FOR DELETE USING (auth.uid() = author_id);