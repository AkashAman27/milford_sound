export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          slug: string
          country: string
          description: string | null
          image_url: string | null
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          country: string
          description?: string | null
          image_url?: string | null
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          country?: string
          description?: string | null
          image_url?: string | null
          featured?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          short_description: string | null
          price: number
          currency: string
          city_id: string
          category_id: string
          image_url: string | null
          gallery_images: string[]
          duration: string | null
          max_group_size: number | null
          featured: boolean
          rating: number | null
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          short_description?: string | null
          price: number
          currency?: string
          city_id: string
          category_id: string
          image_url?: string | null
          gallery_images?: string[]
          duration?: string | null
          max_group_size?: number | null
          featured?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          short_description?: string | null
          price?: number
          currency?: string
          city_id?: string
          category_id?: string
          image_url?: string | null
          gallery_images?: string[]
          duration?: string | null
          max_group_size?: number | null
          featured?: boolean
          rating?: number | null
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          selected_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          selected_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          selected_date?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          currency: string
          status: string
          payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          currency?: string
          status?: string
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          currency?: string
          status?: string
          payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          selected_date: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          selected_date?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          selected_date?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          author_id: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          author_id: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          author_id?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}