import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push('/login'); // Skicka användaren till Login efter registrering
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('/bg.jpg')" }} // Byt ut med din bild
    >
      {/* Mörkt filter för bättre kontrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Registreringskort */}
      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center text-blue-800">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSignup} className="mt-4 space-y-4">
          <input
            type="email"
            placeholder="E-post"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Lösenord"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-full shadow-md hover:bg-blue-900 transition">
            Sign Up
          </button>
        </form>

        {/* Länkar för inloggning */}
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-800 hover:underline">Har du redan ett konto? Logga in</Link>
        </div>
      </div>

      {/* Version info & språkknapp */}
      <div className="absolute bottom-6 flex justify-between w-full px-8 text-white text-sm">
        <Link href="/" className="hover:underline">⬅ Tillbaka</Link>
        <button className="flex items-center space-x-1">
          🌍 <span>SV</span>
        </button>
      </div>
    </div>
  );
}
