import { createClient } from '@supabase/supabase-js'

// Mock Supabase client for development
const mockSupabaseUrl = 'https://mock.supabase.co'
const mockSupabaseKey = 'mock-key'

export const mockSupabase = createClient(mockSupabaseUrl, mockSupabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

// Mock auth methods
const mockUser = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  role: 'authenticated',
}

// Override auth methods with mock implementations
mockSupabase.auth = {
  ...mockSupabase.auth,
  getUser: async () => ({ data: { user: mockUser }, error: null }),
  signInWithPassword: async () => ({ data: { user: mockUser }, error: null }),
  signUp: async () => ({ data: { user: mockUser }, error: null }),
  signOut: async () => ({ error: null }),
}

// Mock database methods
mockSupabase.from = (table: string) => ({
  select: () => Promise.resolve({ data: [], error: null }),
  insert: () => Promise.resolve({ data: { id: 'mock-id' }, error: null }),
  update: () => Promise.resolve({ data: null, error: null }),
  delete: () => Promise.resolve({ data: null, error: null }),
  eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
  order: () => Promise.resolve({ data: [], error: null }),
})

export default mockSupabase
