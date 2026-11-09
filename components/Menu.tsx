'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

export default function Menu() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({ username: 'Invitado', role: 'user', isAdmin: false })

  useEffect(() => {
    // Leer las cookies que guarda el login
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const role = getCookie('user-role');
    const username = getCookie('username');

    if (role === 'admin') {
      setUser({ username: username || 'jucahoflo', role: 'admin', isAdmin: true });
    } else {
      setUser({ username: username || 'Invitado', role: 'user', isAdmin: false });
    }
  }, [])

  const handleLogout = () => {
    document.cookie = "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login')
    router.refresh()
  }
  
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
      
      <nav className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-8 text-center">
            <div className="text-4xl mb-2">🎵</div>
            <h2 className="text-xl font-bold text-white">MUSIC</h2>
            <p className="text-xs text-gray-400">Tu biblioteca musical</p>
          </div>
          
          <div className="mb-6">
            <SearchBar />
          </div>
          
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition" onClick={() => setIsOpen(false)}>
              <span>🏠</span> Inicio
            </Link>
            
            <Link href="/playlists" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition" onClick={() => setIsOpen(false)}>
              <span>📋</span> Listas
            </Link>
            
            <Link href="/playlist" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition" onClick={() => setIsOpen(false)}>
              <span>🎧</span> Mi Playlist
            </Link>
            
            {/* ESTO SOLO APARECE SI ES ADMIN */}
            {user.isAdmin && (
              <>
                <Link href="/upload" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition" onClick={() => setIsOpen(false)}>
                  <span>📤</span> Subir Canción
                </Link>
                
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition" onClick={() => setIsOpen(false)}>
                  <span>👑</span> Administrador
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
              {user.isAdmin ? '👑 Administrador' : '👤 Invitado'}
            </p>
          </div>
          
          {user.isAdmin || user.username !== 'Invitado' ? (
            <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm">
              Cerrar Sesión
            </button>
          ) : (
            <Link href="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition text-sm">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
    </>
  )
}
