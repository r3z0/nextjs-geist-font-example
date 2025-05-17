import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { GameRoom, Message, Move, MockUser } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create the base Supabase client
const supabaseInstance = createClient(supabaseUrl, supabaseKey)

// Create a mock user
const mockUser: MockUser = {
  id: 'mock-user-id',
  app_metadata: { provider: 'email' },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email: 'demo@example.com',
  phone: '',
  role: 'authenticated',
  factors: [],
  identities: [],
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString()
}

// Create a mock session
const mockSession = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: 9999999999,
  token_type: 'bearer',
  user: mockUser
}

// Mock data for different tables
const mockData = {
  games: [{
    id: '1',
    owner_id: mockUser.id,
    status: 'waiting' as const,
    created_at: new Date().toISOString(),
    current_player_id: mockUser.id,
    winner_id: null
  }],
  chat: [{
    id: '1',
    game_id: '1',
    user_id: mockUser.id,
    content: 'Hello!',
    created_at: new Date().toISOString()
  }],
  moves: [{
    id: '1',
    game_id: '1',
    player_id: mockUser.id,
    from: 0,
    to: 1,
    created_at: new Date().toISOString()
  }]
}

// Create a development version of the Supabase client
const developmentClient = {
  ...supabaseInstance,
  auth: {
    ...supabaseInstance.auth,
    getUser: async () => ({
      data: { user: mockUser },
      error: null
    }),
    signInWithPassword: async () => ({
      data: { user: mockUser, session: mockSession },
      error: null
    }),
    signUp: async () => ({
      data: { user: mockUser, session: mockSession },
      error: null
    }),
    signOut: async () => ({ error: null })
  },
  from: (table: string) => {
    return {
      select: () => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({
            data: mockData[table as keyof typeof mockData][0],
            error: null
          }),
          order: (column: string, { ascending = true } = {}) => 
            Promise.resolve({
              data: mockData[table as keyof typeof mockData],
              error: null
            })
        }),
        order: (column: string, { ascending = true } = {}) =>
          Promise.resolve({
            data: mockData[table as keyof typeof mockData],
            error: null
          }),
        or: (filter: string) =>
          Promise.resolve({
            data: mockData[table as keyof typeof mockData],
            error: null
          })
      }),
      insert: (values: any) => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: mockData[table as keyof typeof mockData][0],
              error: null
            })
        })
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) =>
          Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) =>
          Promise.resolve({ data: null, error: null })
      })
    }
  }
} as unknown as SupabaseClient

// Export the appropriate client based on environment
export const supabase = process.env.NODE_ENV === 'development'
  ? developmentClient
  : supabaseInstance

if (process.env.NODE_ENV === 'development') {
  console.warn('Using development Supabase configuration with mock data')
}
