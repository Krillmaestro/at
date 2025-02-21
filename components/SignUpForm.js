import { useState } from 'react'
import supabase from '../lib/supabaseClient'
import Link from 'next/link'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else alert('Kontrollera din e-post för bekräftelse! 📧')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Skapa konto</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="email"
        placeholder="E-post"
        className="w-full mb-4 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Lösenord"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Registrera
      </button>

      <p className="mt-4 text-center">
        Har du redan konto?{' '}
        <Link href="/" className="text-blue-600 hover:underline">
          Logga in här
        </Link>
      </p>
    </form>
  )
}