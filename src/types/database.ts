export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "BBO-faq": {
        Row: {
          answer: string
          created_at: string | null
          id: number
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          question?: string
        }
        Relationships: []
      }
      "BBO-hero": {
        Row: {
          created_at: string | null
          cta_label: string | null
          cta_link: string | null
          id: number
          image_url: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          cta_label?: string | null
          cta_link?: string | null
          id?: number
          image_url?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          cta_label?: string | null
          cta_link?: string | null
          id?: number
          image_url?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      "BBO-internal_link": {
        Row: {
          created_at: string | null
          href: string
          id: number
          label: string
        }
        Insert: {
          created_at?: string | null
          href: string
          id?: number
          label: string
        }
        Update: {
          created_at?: string | null
          href?: string
          id?: number
          label?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          post_count: number | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          post_count?: number | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          post_count?: number | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          blog_post_id: string | null
          created_at: string | null
          id: string
          tag: string
        }
        Insert: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          tag: string
        }
        Update: {
          blog_post_id?: string | null
          created_at?: string | null
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          canonical_url: string | null
          category_id: string | null
          code_snippets: Json | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          focus_keyword: string | null
          id: string
          og_description: string | null
          og_image: string | null
          og_image_alt: string | null
          og_title: string | null
          published: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          robots_follow: boolean | null
          robots_index: boolean | null
          robots_nosnippet: boolean | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          structured_data_type: string | null
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_image_alt: string | null
          twitter_title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          code_snippets?: Json | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          robots_nosnippet?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          structured_data_type?: string | null
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          code_snippets?: Json | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          published?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          robots_nosnippet?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          structured_data_type?: string | null
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number | null
          selected_date: string | null
          selected_time: string | null
          special_requests: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          selected_date?: string | null
          selected_time?: string | null
          special_requests?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          selected_date?: string | null
          selected_time?: string | null
          special_requests?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          experience_count: number | null
          featured: boolean | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          experience_count?: number | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          experience_count?: number | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          country: string
          country_code: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          experience_count: number | null
          featured: boolean | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          slug: string
          sort_order: number | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          country: string
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_count?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          slug: string
          sort_order?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_count?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          slug?: string
          sort_order?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          availability_url: string | null
          bestseller: boolean | null
          booking_count: number | null
          cancellation_policy: string | null
          canonical_url: string | null
          category_id: string | null
          city_id: string | null
          created_at: string | null
          currency: string | null
          description: string
          duration: string | null
          duration_hours: number | null
          featured: boolean | null
          focus_keyword: string | null
          highlights: string[] | null
          id: string
          languages: string[] | null
          main_image_url: string | null
          max_group_size: number | null
          meeting_point: string | null
          min_age: number | null
          og_description: string | null
          og_image: string | null
          og_image_alt: string | null
          og_title: string | null
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          robots_follow: boolean | null
          robots_index: boolean | null
          robots_nosnippet: boolean | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number | null
          status: string | null
          structured_data_type: string | null
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_image_alt: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          availability_url?: string | null
          bestseller?: boolean | null
          booking_count?: number | null
          cancellation_policy?: string | null
          canonical_url?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          duration?: string | null
          duration_hours?: number | null
          featured?: boolean | null
          focus_keyword?: string | null
          highlights?: string[] | null
          id?: string
          languages?: string[] | null
          main_image_url?: string | null
          max_group_size?: number | null
          meeting_point?: string | null
          min_age?: number | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          robots_nosnippet?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          status?: string | null
          structured_data_type?: string | null
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_url?: string | null
          bestseller?: boolean | null
          booking_count?: number | null
          cancellation_policy?: string | null
          canonical_url?: string | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          duration?: string | null
          duration_hours?: number | null
          featured?: boolean | null
          focus_keyword?: string | null
          highlights?: string[] | null
          id?: string
          languages?: string[] | null
          main_image_url?: string | null
          max_group_size?: number | null
          meeting_point?: string | null
          min_age?: number | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          robots_follow?: boolean | null
          robots_index?: boolean | null
          robots_nosnippet?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          structured_data_type?: string | null
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_image_alt?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_items: {
        Row: {
          created_at: string | null
          description_override: string | null
          enabled: boolean | null
          id: string
          image_override: string | null
          item_id: string
          item_type: string
          section: string
          sort_order: number | null
          title_override: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_override?: string | null
          enabled?: boolean | null
          id?: string
          image_override?: string | null
          item_id: string
          item_type: string
          section: string
          sort_order?: number | null
          title_override?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_override?: string | null
          enabled?: boolean | null
          id?: string
          image_override?: string | null
          item_id?: string
          item_type?: string
          section?: string
          sort_order?: number | null
          title_override?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      headout_homepage: {
        Row: {
          created_at: string | null
          featured_categories: Json | null
          featured_products: Json | null
          hero: Json | null
          id: string
          stats: Json | null
          testimonials: Json | null
          updated_at: string | null
          why_choose_us: Json | null
        }
        Insert: {
          created_at?: string | null
          featured_categories?: Json | null
          featured_products?: Json | null
          hero?: Json | null
          id?: string
          stats?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          why_choose_us?: Json | null
        }
        Update: {
          created_at?: string | null
          featured_categories?: Json | null
          featured_products?: Json | null
          hero?: Json | null
          id?: string
          stats?: Json | null
          testimonials?: Json | null
          updated_at?: string | null
          why_choose_us?: Json | null
        }
        Relationships: []
      }
      homepage_featured_categories: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          link: string | null
          name: string | null
          order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          link?: string | null
          name?: string | null
          order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          link?: string | null
          name?: string | null
          order?: number | null
        }
        Relationships: []
      }
      homepage_featured_products: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string | null
          order: number | null
          price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string | null
          order?: number | null
          price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string | null
          order?: number | null
          price?: number | null
        }
        Relationships: []
      }
      homepage_hero: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          subtitle: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          background_color: string | null
          content: string | null
          created_at: string | null
          enabled: boolean | null
          id: string
          image_url: string | null
          link_text: string | null
          link_url: string | null
          section_type: Database["public"]["Enums"]["homepage_section_type"]
          sort_order: number | null
          subtitle: string | null
          text_color: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          content?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          section_type: Database["public"]["Enums"]["homepage_section_type"]
          sort_order?: number | null
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          content?: string | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          section_type?: Database["public"]["Enums"]["homepage_section_type"]
          sort_order?: number | null
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_stats: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          value?: number | null
        }
        Relationships: []
      }
      homepage_testimonials: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string | null
          review: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string | null
          review?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string | null
          review?: string | null
        }
        Relationships: []
      }
      homepage_why_choose_us: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order: number | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number | null
          title?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          selected_date: string | null
          selected_time: string | null
          special_requests: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          selected_date?: string | null
          selected_time?: string | null
          special_requests?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          selected_date?: string | null
          selected_time?: string | null
          special_requests?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_email: string | null
          billing_name: string | null
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          order_number: string
          payment_intent_id: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_email?: string | null
          billing_name?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_email?: string | null
          billing_name?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_highlights: {
        Row: {
          created_at: string | null
          highlight: string
          id: string
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          highlight: string
          id?: string
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          highlight?: string
          id?: string
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_highlights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      product_includes_excludes: {
        Row: {
          created_at: string | null
          id: string
          item: string
          product_id: string | null
          sort_order: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item: string
          product_id?: string | null
          sort_order?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item?: string
          product_id?: string | null
          sort_order?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_includes_excludes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      product_schedule: {
        Row: {
          activity: string
          created_at: string | null
          id: string
          product_id: string | null
          sort_order: number | null
          time_slot: string
        }
        Insert: {
          activity: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          sort_order?: number | null
          time_slot: string
        }
        Update: {
          activity?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          sort_order?: number | null
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_schedule_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          product_id: string | null
          rating: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          product_id?: string | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          product_id?: string | null
          rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          customer_avatar: string | null
          customer_location: string | null
          customer_name: string
          experience_id: string | null
          experience_name: string | null
          featured: boolean | null
          id: string
          rating: number | null
          review_text: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_avatar?: string | null
          customer_location?: string | null
          customer_name: string
          experience_id?: string | null
          experience_name?: string | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          review_text: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_avatar?: string | null
          customer_location?: string | null
          customer_name?: string
          experience_id?: string | null
          experience_name?: string | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          review_text?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_type:
        | "tours"
        | "attractions"
        | "museums"
        | "food"
        | "adventure"
        | "shows"
        | "day_trips"
      homepage_section_type:
        | "hero"
        | "featured_categories"
        | "popular_destinations"
        | "featured_experiences"
        | "testimonials"
        | "stats"
      order_status: "pending" | "confirmed" | "cancelled" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      experience_type: [
        "tours",
        "attractions",
        "museums",
        "food",
        "adventure",
        "shows",
        "day_trips",
      ],
      homepage_section_type: [
        "hero",
        "featured_categories",
        "popular_destinations",
        "featured_experiences",
        "testimonials",
        "stats",
      ],
      order_status: ["pending", "confirmed", "cancelled", "completed"],
    },
  },
} as const