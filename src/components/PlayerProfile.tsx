'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function PlayerProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-gray-600">
            {user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-semibold">{user.email}</h2>
          <p className="text-sm text-gray-500">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm text-white bg-black rounded hover:bg-gray-800 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
