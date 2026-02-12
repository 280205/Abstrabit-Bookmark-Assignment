import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/4 w-full h-full bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="glass rounded-3xl p-10 max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-black mb-3">
            <span className="gradient-text">Smart Bookmarks</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your personal link vault
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
            <h2 className="font-bold text-blue-600 dark:text-blue-400 mb-3 text-lg">
              Amazing Features
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Real-time sync across devices</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Private & secure bookmarks</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Beautiful & intuitive interface</span>
              </li>
            </ul>
          </div>

          <GoogleSignInButton />

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </main>
  )
}
