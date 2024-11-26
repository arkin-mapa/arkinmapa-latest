export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          duration: number
          price: number
          bandwidth: string
          device_limit: number
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          duration: number
          price: number
          bandwidth: string
          device_limit: number
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          duration?: number
          price?: number
          bandwidth?: string
          device_limit?: number
          description?: string
          created_at?: string
        }
      }
      vouchers: {
        Row: {
          id: string
          code: string
          plan_id: string
          status: 'available' | 'used'
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          plan_id: string
          status?: 'available' | 'used'
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          plan_id?: string
          status?: 'available' | 'used'
          user_id?: string | null
          created_at?: string
        }
      }
      purchase_requests: {
        Row: {
          id: string
          plan_id: string
          user_id: string
          customer_name: string
          quantity: number
          payment_method: 'gcash' | 'bank-transfer'
          status: 'pending' | 'confirmed' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          user_id: string
          customer_name: string
          quantity: number
          payment_method: 'gcash' | 'bank-transfer'
          status?: 'pending' | 'confirmed' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          user_id?: string
          customer_name?: string
          quantity?: number
          payment_method?: 'gcash' | 'bank-transfer'
          status?: 'pending' | 'confirmed' | 'rejected'
          created_at?: string
        }
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
  }
}