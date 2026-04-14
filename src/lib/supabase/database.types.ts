export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      candle_events: {
        Row: {
          id: string;
          martyr_id: string;
          session_id: string | null;
          lit_at: string;
        };
        Insert: {
          id?: string;
          martyr_id: string;
          session_id?: string | null;
          lit_at?: string;
        };
        Update: {
          id?: string;
          martyr_id?: string;
          session_id?: string | null;
          lit_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'candle_events_martyr_id_fkey';
            columns: ['martyr_id'];
            isOneToOne: false;
            referencedRelation: 'martyrs';
            referencedColumns: ['id'];
          },
        ];
      };
      martyr_translations: {
        Row: {
          id: string;
          martyr_id: string;
          language: 'en' | 'ar';
          name: string;
          location: string;
          profession: string;
          story: string;
        };
        Insert: {
          id?: string;
          martyr_id: string;
          language: 'en' | 'ar';
          name: string;
          location: string;
          profession: string;
          story: string;
        };
        Update: {
          id?: string;
          martyr_id?: string;
          language?: 'en' | 'ar';
          name?: string;
          location?: string;
          profession?: string;
          story?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'martyr_translations_martyr_id_fkey';
            columns: ['martyr_id'];
            isOneToOne: false;
            referencedRelation: 'martyrs';
            referencedColumns: ['id'];
          },
        ];
      };
      martyrs: {
        Row: {
          id: string;
          age: number;
          date_of_martyrdom: string;
          image_url: string | null;
          candles: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          age: number;
          date_of_martyrdom: string;
          image_url?: string | null;
          candles?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          age?: number;
          date_of_martyrdom?: string;
          image_url?: string | null;
          candles?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          martyr_id: string;
          author_name: string;
          relationship: 'family' | 'friend' | 'stranger';
          type: 'story' | 'photo' | 'voice';
          photo_url: string | null;
          photo_urls: string[] | null;
          audio_url: string | null;
          approved: boolean | null;
          submitted_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: {
          id?: string;
          martyr_id: string;
          author_name?: string;
          relationship: 'family' | 'friend' | 'stranger';
          type: 'story' | 'photo' | 'voice';
          photo_url?: string | null;
          photo_urls?: string[] | null;
          audio_url?: string | null;
          approved?: boolean | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Update: {
          id?: string;
          martyr_id?: string;
          author_name?: string;
          relationship?: 'family' | 'friend' | 'stranger';
          type?: 'story' | 'photo' | 'voice';
          photo_url?: string | null;
          photo_urls?: string[] | null;
          audio_url?: string | null;
          approved?: boolean | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'memories_approved_by_fkey';
            columns: ['approved_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'memories_martyr_id_fkey';
            columns: ['martyr_id'];
            isOneToOne: false;
            referencedRelation: 'martyrs';
            referencedColumns: ['id'];
          },
        ];
      };
      memory_translations: {
        Row: {
          id: string;
          memory_id: string;
          language: 'en' | 'ar';
          content: string;
          translated_by: string | null;
          translated_at: string | null;
        };
        Insert: {
          id?: string;
          memory_id: string;
          language: 'en' | 'ar';
          content: string;
          translated_by?: string | null;
          translated_at?: string | null;
        };
        Update: {
          id?: string;
          memory_id?: string;
          language?: 'en' | 'ar';
          content?: string;
          translated_by?: string | null;
          translated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'memory_translations_memory_id_fkey';
            columns: ['memory_id'];
            isOneToOne: false;
            referencedRelation: 'memories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'memory_translations_translated_by_fkey';
            columns: ['translated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'moderator' | 'user' | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'moderator' | 'user' | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'moderator' | 'user' | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PublicSchema = Database['public'];
export type PublicTables = PublicSchema['Tables'];
