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
          ownerId: string | null
        }
        Insert: {
          createdAt?: string
          gameSettingsId: string
          id?: string
          ownerId?: string | null
        }
        Update: {
          createdAt?: string
          gameSettingsId?: string
          id?: string
          ownerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "BlackJackSessions_gameSettingsId_fkey"
            columns: ["gameSettingsId"]
            isOneToOne: false
            referencedRelation: "GameSettings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BlackJackSessions_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["playerId"]
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
      PlayerHands: {
        Row: {
          actions: Database["public"]["Enums"]["PlayerAction"][] | null
          cards: Database["public"]["Enums"]["Card"][]
          created_at: string
          finalHandValue: number
          handIndex: number | null
          outcome: Database["public"]["Enums"]["HandOutcome"] | null
          payout: number | null
          playerHandId: string
        }
        Insert: {
          actions?: Database["public"]["Enums"]["PlayerAction"][] | null
          cards: Database["public"]["Enums"]["Card"][]
          created_at?: string
          finalHandValue: number
          handIndex?: number | null
          outcome?: Database["public"]["Enums"]["HandOutcome"] | null
          payout?: number | null
          playerHandId?: string
        }
        Update: {
          actions?: Database["public"]["Enums"]["PlayerAction"][] | null
          cards?: Database["public"]["Enums"]["Card"][]
          created_at?: string
          finalHandValue?: number
          handIndex?: number | null
          outcome?: Database["public"]["Enums"]["HandOutcome"] | null
          payout?: number | null
          playerHandId?: string
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
      PlayerTurns: {
        Row: {
          chipDelta: number
          created_at: string
          hands: string | null
          initialBet: number
          initialCards: Database["public"]["Enums"]["Card"][]
          insuranceBet: number | null
          playerId: string
          position: string | null
          totalBet: number | null
          totalPayout: number
          turnId: string
        }
        Insert: {
          chipDelta: number
          created_at?: string
          hands?: string | null
          initialBet: number
          initialCards: Database["public"]["Enums"]["Card"][]
          insuranceBet?: number | null
          playerId: string
          position?: string | null
          totalBet?: number | null
          totalPayout: number
          turnId?: string
        }
        Update: {
          chipDelta?: number
          created_at?: string
          hands?: string | null
          initialBet?: number
          initialCards?: Database["public"]["Enums"]["Card"][]
          insuranceBet?: number | null
          playerId?: string
          position?: string | null
          totalBet?: number | null
          totalPayout?: number
          turnId?: string
        }
        Relationships: [
          {
            foreignKeyName: "PlayerTurns_hands_fkey"
            columns: ["hands"]
            isOneToOne: false
            referencedRelation: "PlayerHands"
            referencedColumns: ["playerHandId"]
          },
          {
            foreignKeyName: "PlayerTurns_playerId_fkey"
            columns: ["playerId"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["playerId"]
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
      Card:
        | "A of Spades"
        | "2 of Spades"
        | "3 of Spades"
        | "4 of Spades"
        | "5 of Spades"
        | "6 of Spades"
        | "7 of Spades"
        | "8 of Spades"
        | "9 of Spades"
        | "T of Spades"
        | "J of Spades"
        | "Q of Spades"
        | "K of Spades"
        | "A of Diamonds"
        | "2 of Diamonds"
        | "3 of Diamonds"
        | "4 of Diamonds"
        | "5 of Diamonds"
        | "6 of Diamonds"
        | "7 of Diamonds"
        | "8 of Diamonds"
        | "9 of Diamonds"
        | "T of Diamonds"
        | "J of Diamonds"
        | "Q of Diamonds"
        | "K of Diamonds"
        | "K of Clubs"
        | "Q of Clubs"
        | "J of Clubs"
        | "T of Clubs"
        | "9 of Clubs"
        | "8 of Clubs"
        | "7 of Clubs"
        | "6 of Clubs"
        | "5 of Clubs"
        | "4 of Clubs"
        | "3 of Clubs"
        | "2 of Clubs"
        | "K of Hearts"
        | "Q of Hearts"
        | "J of Hearts"
        | "T of Hearts"
        | "9 of Hearts"
        | "8 of Hearts"
        | "7 of Hearts"
        | "6 of Hearts"
        | "5 of Hearts"
        | "4 of Hearts"
        | "3 of Hearts"
        | "2 of Hearts"
        | "A of Hearts"
      HandOutcome: "win" | "loss" | "push" | "blackjack" | "bust" | "surrender"
      PlayerAction:
        | "hit"
        | "stand"
        | "double"
        | "split"
        | "surrender"
        | "insurance"
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
      Card: [
        "A of Spades",
        "2 of Spades",
        "3 of Spades",
        "4 of Spades",
        "5 of Spades",
        "6 of Spades",
        "7 of Spades",
        "8 of Spades",
        "9 of Spades",
        "T of Spades",
        "J of Spades",
        "Q of Spades",
        "K of Spades",
        "A of Diamonds",
        "2 of Diamonds",
        "3 of Diamonds",
        "4 of Diamonds",
        "5 of Diamonds",
        "6 of Diamonds",
        "7 of Diamonds",
        "8 of Diamonds",
        "9 of Diamonds",
        "T of Diamonds",
        "J of Diamonds",
        "Q of Diamonds",
        "K of Diamonds",
        "K of Clubs",
        "Q of Clubs",
        "J of Clubs",
        "T of Clubs",
        "9 of Clubs",
        "8 of Clubs",
        "7 of Clubs",
        "6 of Clubs",
        "5 of Clubs",
        "4 of Clubs",
        "3 of Clubs",
        "2 of Clubs",
        "K of Hearts",
        "Q of Hearts",
        "J of Hearts",
        "T of Hearts",
        "9 of Hearts",
        "8 of Hearts",
        "7 of Hearts",
        "6 of Hearts",
        "5 of Hearts",
        "4 of Hearts",
        "3 of Hearts",
        "2 of Hearts",
        "A of Hearts",
      ],
      HandOutcome: ["win", "loss", "push", "blackjack", "bust", "surrender"],
      PlayerAction: [
        "hit",
        "stand",
        "double",
        "split",
        "surrender",
        "insurance",
      ],
    },
  },
} as const
