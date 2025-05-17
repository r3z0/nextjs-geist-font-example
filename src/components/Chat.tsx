'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import type { Message } from '@/types'

interface ChatProps {
  gameId: string
}

export default function Chat({ gameId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser()
    fetchMessages()

    // In development, poll for new messages every 3 seconds
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [gameId])

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat')
        .select()
        .eq('game_id', gameId)
        .order('created_at', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setMessages(data as Message[])
      }
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('chat')
        .insert({
          game_id: gameId,
          user_id: user.id,
          content: newMessage.trim()
        })

      if (error) throw error
      setNewMessage('')
      // Fetch messages immediately after sending
      fetchMessages()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="p-4">Loading messages...</div>
  }

  return (
    <div className="border rounded-lg bg-white p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${
              message.user_id === user?.id
                ? 'bg-black text-white ml-auto'
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
