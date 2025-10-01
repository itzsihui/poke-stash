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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      boxes: {
        Row: {
          active: boolean | null
          box_type: string | null
          common_odds: number
          created_at: string | null
          epic_odds: number
          id: string
          legendary_odds: number
          name: string | null
          price: number
          price_usdt: number | null
          rare_odds: number
          stock_limit: number | null
        }
        Insert: {
          active?: boolean | null
          box_type?: string | null
          common_odds?: number
          created_at?: string | null
          epic_odds?: number
          id?: string
          legendary_odds?: number
          name?: string | null
          price?: number
          price_usdt?: number | null
          rare_odds?: number
          stock_limit?: number | null
        }
        Update: {
          active?: boolean | null
          box_type?: string | null
          common_odds?: number
          created_at?: string | null
          epic_odds?: number
          id?: string
          legendary_odds?: number
          name?: string | null
          price?: number
          price_usdt?: number | null
          rare_odds?: number
          stock_limit?: number | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          box_type: string | null
          created_at: string | null
          estimated_value: number | null
          id: string
          image_url: string
          name: string
          physical_available: boolean | null
          rarity: Database["public"]["Enums"]["card_rarity"]
        }
        Insert: {
          box_type?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          image_url: string
          name: string
          physical_available?: boolean | null
          rarity: Database["public"]["Enums"]["card_rarity"]
        }
        Update: {
          box_type?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          image_url?: string
          name?: string
          physical_available?: boolean | null
          rarity?: Database["public"]["Enums"]["card_rarity"]
        }
        Relationships: []
      }
      inventory: {
        Row: {
          acquired_at: string | null
          card_id: string
          id: string
          telegram_id: string
        }
        Insert: {
          acquired_at?: string | null
          card_id: string
          id?: string
          telegram_id: string
        }
        Update: {
          acquired_at?: string | null
          card_id?: string
          id?: string
          telegram_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_inventory: {
        Row: {
          box_id: string | null
          card_id: string | null
          created_at: string | null
          id: string
          quantity: number | null
        }
        Insert: {
          box_id?: string | null
          card_id?: string | null
          created_at?: string | null
          id?: string
          quantity?: number | null
        }
        Update: {
          box_id?: string | null
          card_id?: string | null
          created_at?: string | null
          id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_inventory_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machine_inventory_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          telegram_id: string | null
          telegram_username: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          telegram_id?: string | null
          telegram_username?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          telegram_id?: string | null
          telegram_username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          card_id: string
          created_at: string | null
          delivery_fee: number | null
          id: string
          inventory_id: string
          shipped_at: string | null
          shipping_address: string
          status: Database["public"]["Enums"]["redemption_status"]
          telegram_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          inventory_id: string
          shipped_at?: string | null
          shipping_address: string
          status?: Database["public"]["Enums"]["redemption_status"]
          telegram_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          delivery_fee?: number | null
          id?: string
          inventory_id?: string
          shipped_at?: string | null
          shipping_address?: string
          status?: Database["public"]["Enums"]["redemption_status"]
          telegram_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          card_id: string | null
          created_at: string | null
          id: string
          telegram_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          card_id?: string | null
          created_at?: string | null
          id?: string
          telegram_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          card_id?: string | null
          created_at?: string | null
          id?: string
          telegram_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      draw_from_gacha: {
        Args: { p_box_id: string; p_telegram_id: string }
        Returns: {
          card_id: string
          card_image: string
          card_name: string
          card_rarity: string
          card_value: number
        }[]
      }
    }
    Enums: {
      card_rarity: "legendary" | "epic" | "rare" | "common"
      redemption_status: "pending" | "shipped" | "delivered"
      transaction_type: "box_purchase" | "redemption_fee"
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
      card_rarity: ["legendary", "epic", "rare", "common"],
      redemption_status: ["pending", "shipped", "delivered"],
      transaction_type: ["box_purchase", "redemption_fee"],
    },
  },
} as const
