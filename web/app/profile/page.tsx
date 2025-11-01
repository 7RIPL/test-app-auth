"use client"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<{ id: string; login: string; email: string; displayName: string; registeredAt: string } | null>(null)

  const { register, handleSubmit, reset } = useForm<{ displayName: string }>()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Ошибка загрузки профиля')
        setProfile(json)
        reset({ displayName: json.displayName })
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reset])

  const onSubmit = async (data: { displayName: string }) => {
    setError(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка обновления профиля')
      setProfile(json)
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (loading) return <div className="p-6">Загрузка...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!profile) return null

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="border rounded p-4">
        <h1 className="text-xl font-semibold mb-2">Профиль</h1>
        <p><b>Логин:</b> {profile.login}</p>
        <p><b>Email:</b> {profile.email}</p>
        <p><b>Отображаемое имя:</b> {profile.displayName}</p>
        <p><b>Дата регистрации:</b> {new Date(profile.registeredAt).toLocaleString()}</p>
      </div>
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Редактировать профиль</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Отображаемое имя</label>
            <input className="w-full border rounded px-3 py-2" {...register('displayName', { required: true })} />
          </div>
          <button className="bg-black text-white px-4 py-2 rounded">Сохранить</button>
        </form>
      </div>
    </div>
  )
}
