'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Menu() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string; isAdmin: boolean }>({
    username: 'Invitado',
    role: 'guest',
    isAdmin: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUser({
          username: data.username || 'Invitado',
          role: data.role || 'guest',
          isAdmin: data.role === 'admin'
        })
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  
  // No mostrar menú en login/register
  if (pathname === '/login' || pathname === '/register') {
    return null
  }
  
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <nav className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 flex-1">
          <div className="mb-8 text-center">
            <div className="text-4xl mb-2">🎵</div>
            <h2 className="text-xl font-bold text-white">MUSIC</h2>
            <p className="text-xs text-gray-400">Tu biblioteca musical</p>
          </div>
          
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition" onClick={() => setIsOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Inicio
            </Link>
            
            <Link href="/playlists" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition" onClick={() => setIsOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              Listas
            </Link>
            
            {/* Opciones solo para administrador */}
            {user.isAdmin && (
              <>
                <Link href="/upload" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition" onClick={() => setIsOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Subir Canción
                </Link>
                
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition" onClick={() => setIsOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Administrador
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6 pt-0 border-t border-gray-700">
          <div className="mb-3">
            <p className="text-sm text-gray-400">Conectado como</p>
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-xs text-gray-500">
              {user.isAdmin ? 'Administrador' : user.role === 'user' ? 'Usuario' : 'Invitado'}
            </p>
          </div>
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm">
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </>
  )
}
