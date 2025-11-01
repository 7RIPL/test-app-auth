import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-x-4">
        <Link className="underline" href="/login">Вход</Link>
        <Link className="underline" href="/register">Регистрация</Link>
        <Link className="underline" href="/profile">Профиль</Link>
      </div>
    </main>
  )
}
