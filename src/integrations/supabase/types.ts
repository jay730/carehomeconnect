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
      bank_details: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string | null
          id: string
          routing_number: string
          updated_at: string | null
          use_for_both: boolean | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          created_at?: string | null
          id?: string
          routing_number: string
          updated_at?: string | null
          use_for_both?: boolean | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          routing_number?: string
          updated_at?: string | null
          use_for_both?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          care_home_id: string
          created_at: string
          id: string
          payment_status: string | null
          resident_name: string
          start_date: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          care_home_id: string
          created_at?: string
          id?: string
          payment_status?: string | null
          resident_name: string
          start_date: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          care_home_id?: string
          created_at?: string
          id?: string
          payment_status?: string | null
          resident_name?: string
          start_date?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      care_home_amenities: {
        Row: {
          care_home_id: string
          communal_dining: boolean
          ensuite_rooms: boolean
          entertainment_area: boolean
          garden: boolean
          housekeeping: boolean
          id: string
          laundry: boolean
          private_rooms: boolean
          transportation: boolean
        }
        Insert: {
          care_home_id: string
          communal_dining?: boolean
          ensuite_rooms?: boolean
          entertainment_area?: boolean
          garden?: boolean
          housekeeping?: boolean
          id?: string
          laundry?: boolean
          private_rooms?: boolean
          transportation?: boolean
        }
        Update: {
          care_home_id?: string
          communal_dining?: boolean
          ensuite_rooms?: boolean
          entertainment_area?: boolean
          garden?: boolean
          housekeeping?: boolean
          id?: string
          laundry?: boolean
          private_rooms?: boolean
          transportation?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "care_home_amenities_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      care_home_media: {
        Row: {
          care_home_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          photo_url: string | null
          video_url: string | null
        }
        Insert: {
          care_home_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          photo_url?: string | null
          video_url?: string | null
        }
        Update: {
          care_home_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          photo_url?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_home_media_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      care_home_services: {
        Row: {
          care_home_id: string
          id: string
          meal_preparation: boolean
          medication_management: boolean
          memory_care: boolean
          mobility_assistance: boolean
          personal_care: boolean
          social_activities: boolean
          twenty_four_hour_staff: boolean
        }
        Insert: {
          care_home_id: string
          id?: string
          meal_preparation?: boolean
          medication_management?: boolean
          memory_care?: boolean
          mobility_assistance?: boolean
          personal_care?: boolean
          social_activities?: boolean
          twenty_four_hour_staff?: boolean
        }
        Update: {
          care_home_id?: string
          id?: string
          meal_preparation?: boolean
          medication_management?: boolean
          memory_care?: boolean
          mobility_assistance?: boolean
          personal_care?: boolean
          social_activities?: boolean
          twenty_four_hour_staff?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "care_home_services_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      care_homes: {
        Row: {
          active: boolean | null
          address: string
          capacity: number
          city: string
          created_at: string
          description: string
          id: string
          name: string
          owner_id: string
          price: number
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          active?: boolean | null
          address: string
          capacity: number
          city: string
          created_at?: string
          description: string
          id?: string
          name: string
          owner_id: string
          price: number
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          active?: boolean | null
          address?: string
          capacity?: number
          city?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner_id?: string
          price?: number
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          care_home_id: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          care_home_id: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          care_home_id?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
