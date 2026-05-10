'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.username) setUser(data);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="mt-auto pt-6 border-t border-gray-700">
      <div className="mb-3">
        <p className="text-sm text-gray-400">Conectado como</p>
        <p className="text-white font-semibold">{user.username}</p>
        <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
      </div>
      {user.role === 'admin' && (
        <button
          onClick={() => router.push('/admin')}
          className="w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm"
        >
          Panel Admin
        </button>
      )}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
