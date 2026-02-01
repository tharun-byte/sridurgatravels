export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      banner_images: {
        Row: {
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string
          is_active: boolean | null
          position: number
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          position: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          position?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          drop_location: string | null
          id: string
          num_passengers: number
          pickup_location: string | null
          return_date: string | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          travel_date: string
          travel_time: string | null
          trek_id: string | null
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          drop_location?: string | null
          id?: string
          num_passengers?: number
          pickup_location?: string | null
          return_date?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          travel_date: string
          travel_time?: string | null
          trek_id?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          drop_location?: string | null
          id?: string
          num_passengers?: number
          pickup_location?: string | null
          return_date?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          travel_date?: string
          travel_time?: string | null
          trek_id?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trek_id_fkey"
            columns: ["trek_id"]
            isOneToOne: false
            referencedRelation: "treks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          category_id: string | null
          created_at: string
          display_order: number | null
          id: string
          url: string
        }
        Insert: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          url: string
        }
        Update: {
          caption?: string | null
          category_id?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          name: string
          rating: number | null
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name: string
          rating?: number | null
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          name?: string
          rating?: number | null
        }
        Relationships: []
      }
      trek_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_primary: boolean | null
          trek_id: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          trek_id: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          trek_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "trek_images_trek_id_fkey"
            columns: ["trek_id"]
            isOneToOne: false
            referencedRelation: "treks"
            referencedColumns: ["id"]
          },
        ]
      }
      trek_reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          name: string
          rating: number | null
          trek_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          name: string
          rating?: number | null
          trek_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          name?: string
          rating?: number | null
          trek_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trek_reviews_trek_id_fkey"
            columns: ["trek_id"]
            isOneToOne: false
            referencedRelation: "treks"
            referencedColumns: ["id"]
          },
        ]
      }
      treks: {
        Row: {
          altitude: string | null
          created_at: string
          description: string | null
          destination: string
          difficulty: Database["public"]["Enums"]["trek_difficulty"]
          distance: string | null
          duration: string
          exclusions: Json | null
          highlights: Json | null
          id: string
          important_notes: string | null
          inclusions: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          name: string
          price_per_person: number
          review_count: number | null
          things_to_carry: Json | null
          updated_at: string
        }
        Insert: {
          altitude?: string | null
          created_at?: string
          description?: string | null
          destination: string
          difficulty?: Database["public"]["Enums"]["trek_difficulty"]
          distance?: string | null
          duration: string
          exclusions?: Json | null
          highlights?: Json | null
          id?: string
          important_notes?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          name: string
          price_per_person: number
          review_count?: number | null
          things_to_carry?: Json | null
          updated_at?: string
        }
        Update: {
          altitude?: string | null
          created_at?: string
          description?: string | null
          destination?: string
          difficulty?: Database["public"]["Enums"]["trek_difficulty"]
          distance?: string | null
          duration?: string
          exclusions?: Json | null
          highlights?: Json | null
          id?: string
          important_notes?: string | null
          inclusions?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          name?: string
          price_per_person?: number
          review_count?: number | null
          things_to_carry?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_primary: boolean | null
          url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          base_price: number
          capacity: number
          created_at: string
          description: string | null
          driver_bata: number | null
          extra_hour_rate: number | null
          extra_km_rate: number | null
          features: Json | null
          full_day_price: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          outstation_allowance: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at: string
        }
        Insert: {
          base_price: number
          capacity: number
          created_at?: string
          description?: string | null
          driver_bata?: number | null
          extra_hour_rate?: number | null
          extra_km_rate?: number | null
          features?: Json | null
          full_day_price?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          outstation_allowance?: string | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
        }
        Update: {
          base_price?: number
          capacity?: number
          created_at?: string
          description?: string | null
          driver_bata?: number | null
          extra_hour_rate?: number | null
          extra_km_rate?: number | null
          features?: Json | null
          full_day_price?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          outstation_allowance?: string | null
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_manager: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "manager" | "staff"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      booking_type: "vehicle" | "trek"
      trek_difficulty: "easy" | "moderate" | "challenging" | "difficult"
      vehicle_type:
        | "car"
        | "tempo_traveller"
        | "mini_bus"
        | "coach"
        | "luxury_bus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "manager", "staff"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      booking_type: ["vehicle", "trek"],
      trek_difficulty: ["easy", "moderate", "challenging", "difficult"],
      vehicle_type: [
        "car",
        "tempo_traveller",
        "mini_bus",
        "coach",
        "luxury_bus",
      ],
    },
  },
} as const
