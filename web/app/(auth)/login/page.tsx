'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ loginOrEmail: string; password: string }>()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: { loginOrEmail: string; password: string }) => {
    setServerError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const contentType = res.headers.get('content-type') || ''
      const payload = contentType.includes('application/json') ? await res.json() : { error: await res.text() }
      if (!res.ok) throw new Error((payload as any).error || 'Ошибка входа')
      localStorage.setItem('token', (payload as any).accessToken)
      window.location.href = '/profile'
    } catch (e: any) {
      setServerError(e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Логин или Email</label>
            <input className="w-full border rounded px-3 py-2" {...register('loginOrEmail', { required: 'Обязательное поле' })} />
            {errors.loginOrEmail && <p className="text-sm text-red-600 mt-1">{errors.loginOrEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input type="password" className="w-full border rounded px-3 py-2" {...register('password', { required: 'Обязательное поле' })} />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Войти</button>
        </form>
        <p className="text-sm mt-4">Нет аккаунта? <Link className="underline" href="/register">Регистрация</Link></p>
      </div>
    </div>
  )
}
