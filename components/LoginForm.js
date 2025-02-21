import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onLoginSuccess(data.user); // Uppdatera användardata i index.js
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Logga in</h2>

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
        Logga in
      </button>

      {/* Länkar för Glömt Lösenord & Registrera */}
      <p className="mt-4 text-center">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Glömt lösenord?
        </Link>
      </p>

      <p className="mt-2 text-center">
        Har du inget konto?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Registrera dig här
        </Link>
      </p>
    </form>
  );
}
