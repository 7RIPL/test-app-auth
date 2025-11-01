'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

type FormData = { login: string; email: string; password: string; displayName: string }

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const contentType = res.headers.get('content-type') || ''
      const payload = contentType.includes('application/json') ? await res.json() : { error: await res.text() }
      if (!res.ok) throw new Error((payload as any).error || 'Ошибка регистрации')
      localStorage.setItem('token', (payload as any).accessToken)
      window.location.href = '/profile'
    } catch (e: any) {
      setServerError(e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Логин</label>
            <input className="w-full border rounded px-3 py-2" {...register('login', { required: 'Обязательное поле', minLength: { value: 3, message: 'Минимум 3 символа' } })} />
            {errors.login && <p className="text-sm text-red-600 mt-1">{errors.login.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" {...register('email', { required: 'Обязательное поле' })} />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Отображаемое имя</label>
            <input className="w-full border rounded px-3 py-2" {...register('displayName', { required: 'Обязательное поле' })} />
            {errors.displayName && <p className="text-sm text-red-600 mt-1">{errors.displayName.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input type="password" className="w-full border rounded px-3 py-2" {...register('password', { required: 'Обязательное поле', minLength: { value: 8, message: 'Минимум 8 символов' } })} />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <button disabled={isSubmitting} className="w-full bg-black text-white py-2 rounded">Зарегистрироваться</button>
        </form>
        <p className="text-sm mt-4">Уже есть аккаунт? <Link className="underline" href="/login">Войти</Link></p>
      </div>
    </div>
  )
}
