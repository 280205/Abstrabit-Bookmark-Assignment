'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import BookmarkItem from './BookmarkItem'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface BookmarkListProps {
  userId: string
}

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
  }

  useEffect(() => {
    // Fetch initial bookmarks
    const loadInitialBookmarks = async () => {
      await fetchBookmarks()
      setLoading(false)
    }

    loadInitialBookmarks()

    // Listen for manual bookmark additions
    const handleBookmarkAdded = () => {
      fetchBookmarks()
    }
    window.addEventListener('bookmark-added', handleBookmarkAdded)

    // Set up real-time subscription
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time event received:', payload.eventType, payload)
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id
                  ? (payload.new as Bookmark)
                  : bookmark
              )
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('bookmark-added', handleBookmarkAdded)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-blue-500 flex items-center justify-center shadow-2xl mx-auto">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No bookmarks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
          Start building your collection
        </p>
        <div className="glass inline-block px-6 py-3 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Tip:</span> Add your first bookmark using the form above
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}
