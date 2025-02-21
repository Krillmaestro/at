import Link from 'next/link';

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('/bg.jpg')" }} // Byt ut med din bild
    >
      {/* Mörkt filter för bättre kontrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Logotyp */}
      <h1 className="text-white text-6xl font-bold relative z-10">Alpine Training</h1>

      {/* Knappar */}
      <div className="relative z-10 mt-6 space-y-4">
        <Link href="/login">
          <button className="w-64 py-3 text-lg font-semibold bg-blue-800 text-white rounded-full shadow-md hover:bg-blue-900 transition">
            Log in
          </button>
        </Link>
        <Link href="/signup">
          <button className="w-64 py-3 text-lg font-semibold bg-blue-800 text-white rounded-full shadow-md hover:bg-blue-900 transition">
            Sign up
          </button>
        </Link>
      </div>

      {/* Version info & språkknapp */}
      <div className="absolute bottom-6 flex justify-between w-full px-8 text-white text-sm">
        <p>Version: 1.0.0</p>
        <button className="flex items-center space-x-1">
          🌍 <span>SV</span>
        </button>
      </div>
    </div>
  );
}
