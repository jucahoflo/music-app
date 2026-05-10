'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'

interface User {
  username: string
  email: string
  role: string
  createdAt: string
  lastLogin: string | null
}

interface Stats {
  totalVisits: number
  visitsToday: number
  totalUsers: number
  newUsers: number
  users: User[]
  visitsByPage: { path: string; visits: number }[]
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Verificar si es admin
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.role !== 'admin') {
          router.push('/')
          return
        }
        setIsAdmin(true)
      })
      .catch(() => router.push('/'))
  }, [router])

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => {
          setStats(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [isAdmin])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">Cargando estadísticas...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>
          
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-2">👁️</div>
              <div className="text-2xl font-bold">{stats?.totalVisits || 0}</div>
              <div className="text-gray-600">Visitas totales</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold">{stats?.visitsToday || 0}</div>
              <div className="text-gray-600">Visitas hoy</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="text-gray-600">Usuarios registrados</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl mb-2">🆕</div>
              <div className="text-2xl font-bold">{stats?.newUsers || 0}</div>
              <div className="text-gray-600">Nuevos (7 días)</div>
            </div>
          </div>
          
          {/* Tabla de usuarios */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Usuarios Registrados</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Usuario</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Rol</th>
                    <th className="px-6 py-3 text-left">Fecha Registro</th>
                    <th className="px-6 py-3 text-left">Último Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats?.users && stats.users.length > 0 ? (
                    stats.users.map((user) => (
                      <tr key={user.username}>
                        <td className="px-6 py-4 font-medium">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Visitas por página */}
          {stats?.visitsByPage && stats.visitsByPage.length > 0 && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Visitas por Página</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Página</th>
                      <th className="px-6 py-3 text-left">Visitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.visitsByPage.map((page) => (
                      <tr key={page.path}>
                        <td className="px-6 py-4 font-medium">{page.path}</td>
                        <td className="px-6 py-4">{page.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
