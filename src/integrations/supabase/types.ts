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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_labor: {
        Row: {
          carpenters: number
          electricians: number
          helpers: number
          id: string
          masons: number
          painters: number
          plumbers: number
          project_id: string
          supervisors: number
        }
        Insert: {
          carpenters?: number
          electricians?: number
          helpers?: number
          id?: string
          masons?: number
          painters?: number
          plumbers?: number
          project_id: string
          supervisors?: number
        }
        Update: {
          carpenters?: number
          electricians?: number
          helpers?: number
          id?: string
          masons?: number
          painters?: number
          plumbers?: number
          project_id?: string
          supervisors?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_labor_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_materials: {
        Row: {
          aggregate: number
          bricks: number
          cement: number
          doors: number
          electrical: number
          fixtures: number
          flooring: number
          glasswork: number
          id: string
          miscellaneous: number
          paint: number
          plumbing: number
          project_id: string
          roofing: number
          sand: number
          steel: number
          tiles_marble: number
          windows: number
          wood: number
        }
        Insert: {
          aggregate?: number
          bricks?: number
          cement?: number
          doors?: number
          electrical?: number
          fixtures?: number
          flooring?: number
          glasswork?: number
          id?: string
          miscellaneous?: number
          paint?: number
          plumbing?: number
          project_id: string
          roofing?: number
          sand?: number
          steel?: number
          tiles_marble?: number
          windows?: number
          wood?: number
        }
        Update: {
          aggregate?: number
          bricks?: number
          cement?: number
          doors?: number
          electrical?: number
          fixtures?: number
          flooring?: number
          glasswork?: number
          id?: string
          miscellaneous?: number
          paint?: number
          plumbing?: number
          project_id?: string
          roofing?: number
          sand?: number
          steel?: number
          tiles_marble?: number
          windows?: number
          wood?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_optimizations: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          implementation_complexity: string
          potential_savings: number
          project_id: string
          quality_impact: string
          time_impact: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          implementation_complexity: string
          potential_savings: number
          project_id: string
          quality_impact: string
          time_impact: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          implementation_complexity?: string
          potential_savings?: number
          project_id?: string
          quality_impact?: string
          time_impact?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_optimizations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_overhead: {
        Row: {
          contingency: number
          design: number
          equipment: number
          id: string
          insurance: number
          permits: number
          project_id: string
          site_preparation: number
          transportation: number
          utilities: number
        }
        Insert: {
          contingency?: number
          design?: number
          equipment?: number
          id?: string
          insurance?: number
          permits?: number
          project_id: string
          site_preparation?: number
          transportation?: number
          utilities?: number
        }
        Update: {
          contingency?: number
          design?: number
          equipment?: number
          id?: string
          insurance?: number
          permits?: number
          project_id?: string
          site_preparation?: number
          transportation?: number
          utilities?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_overhead_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_predictions: {
        Row: {
          confidence_level: string
          created_at: string
          factors: string[] | null
          id: string
          predicted_total: number
          project_id: string
          reasoning: string | null
        }
        Insert: {
          confidence_level: string
          created_at?: string
          factors?: string[] | null
          id?: string
          predicted_total: number
          project_id: string
          reasoning?: string | null
        }
        Update: {
          confidence_level?: string
          created_at?: string
          factors?: string[] | null
          id?: string
          predicted_total?: number
          project_id?: string
          reasoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_predictions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area: number
          construction_type: string | null
          created_at: string
          currency: string | null
          floors: number
          id: string
          location: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          area: number
          construction_type?: string | null
          created_at?: string
          currency?: string | null
          floors?: number
          id?: string
          location?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: number
          construction_type?: string | null
          created_at?: string
          currency?: string | null
          floors?: number
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
          user_id?: string
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
