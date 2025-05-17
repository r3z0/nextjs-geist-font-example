import { User } from '@supabase/supabase-js'

export interface GameRoom {
  id: string
  owner_id: string
  status: 'waiting' | 'playing' | 'finished'
  current_player_id: string | null
  winner_id: string | null
  created_at: string
}

export interface Message {
  id: string
  game_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Move {
  id: string
  game_id: string
  player_id: string
  from: number
  to: number
  created_at: string
}

export interface MockData {
  games: GameRoom[]
  chat: Message[]
  moves: Move[]
}

export interface MockUser extends User {
  email: string
  phone: string
  created_at: string
  updated_at: string
  confirmed_at: string
  email_confirmed_at: string
  last_sign_in_at: string
}
