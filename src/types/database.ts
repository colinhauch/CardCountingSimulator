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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      BlackJackSessions: {
        Row: {
          createdAt: string
          gameSettingsId: string
          id: string
        }
        Insert: {
          createdAt?: string
          gameSettingsId: string
          id?: string
        }
        Update: {
          createdAt?: string
          gameSettingsId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "BlackJackSessions_gameSettingsId_fkey"
            columns: ["gameSettingsId"]
            isOneToOne: false
            referencedRelation: "GameSettings"
            referencedColumns: ["id"]
          },
        ]
      }
      GameSettings: {
        Row: {
          allowDoubleAfterSplit: boolean
          allowResplitAces: boolean
          allowSurrender: boolean
          created_at: string
          dealerHitsSoft17: boolean
          gameType: string
          id: string
          insuranceAllowed: boolean
          maxBet: number
          maxSplits: number
          minBet: number
          numOfDecks: number
          payoutBlackjack: number
          shuffleFrequency: string
          signature: string
        }
        Insert: {
          allowDoubleAfterSplit: boolean
          allowResplitAces: boolean
          allowSurrender: boolean
          created_at?: string
          dealerHitsSoft17: boolean
          gameType: string
          id?: string
          insuranceAllowed: boolean
          maxBet: number
          maxSplits: number
          minBet: number
          numOfDecks: number
          payoutBlackjack: number
          shuffleFrequency: string
          signature: string
        }
        Update: {
          allowDoubleAfterSplit?: boolean
          allowResplitAces?: boolean
          allowSurrender?: boolean
          created_at?: string
          dealerHitsSoft17?: boolean
          gameType?: string
          id?: string
          insuranceAllowed?: boolean
          maxBet?: number
          maxSplits?: number
          minBet?: number
          numOfDecks?: number
          payoutBlackjack?: number
          shuffleFrequency?: string
          signature?: string
        }
        Relationships: []
      }
      Players: {
        Row: {
          createdAt: string
          currentStackSize: number
          name: string
          playerId: string
          position: string | null
          startingStackSize: number
        }
        Insert: {
          createdAt?: string
          currentStackSize: number
          name: string
          playerId?: string
          position?: string | null
          startingStackSize: number
        }
        Update: {
          createdAt?: string
          currentStackSize?: number
          name?: string
          playerId?: string
          position?: string | null
          startingStackSize?: number
        }
        Relationships: []
      }
      PlayerSessions: {
        Row: {
          createdAt: string
          playerId: string
          sessionId: string
          totalHandsDealt: number | null
        }
        Insert: {
          createdAt?: string
          playerId: string
          sessionId: string
          totalHandsDealt?: number | null
        }
        Update: {
          createdAt?: string
          playerId?: string
          sessionId?: string
          totalHandsDealt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "PlayerSessions_playerId_fkey"
            columns: ["playerId"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["playerId"]
          },
          {
            foreignKeyName: "PlayerSessions_sessionId_fkey"
            columns: ["sessionId"]
            isOneToOne: false
            referencedRelation: "BlackJackSessions"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
