'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface AddBookmarkFormProps {
  userId: string
}

interface AddBookmarkFormProps {
  userId: string
}

export default function AddBookmarkForm({ userId }: AddBookmarkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('bookmarks')
      .insert([
        {
          title: title.trim(),
          url: url.trim(),
          user_id: userId,
        },
      ])
      .select()

    if (insertError) {
      setError(insertError.message)
    } else {
      setTitle('')
      setUrl('')
      // Trigger custom event to notify BookmarkList
      window.dispatchEvent(new CustomEvent('bookmark-added'))
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="glass border-l-4 border-red-500 px-5 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
        >
          <span>Title</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-5 py-3 glass rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 text-gray-900 dark:text-white font-medium"
          placeholder="My Awesome Website"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="url"
          className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
        >
          <span>URL</span>
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full px-5 py-3 glass rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 text-gray-900 dark:text-white font-medium"
          placeholder="https://example.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <span>Add Bookmark</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </>
          )}
        </div>
      </button>
    </form>
  )
}
