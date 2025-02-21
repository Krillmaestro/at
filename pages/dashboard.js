import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import AddWorkout from '../components/AddWorkout';
import WorkoutList from '../components/WorkoutList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/'); // Skickar användaren tillbaka till startsidan om de inte är inloggade
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) router.push('/'); // Skickar utloggade användare till index
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Skicka användaren tillbaka till startsidan vid utloggning
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Min Dashboard 🏋️
        </h1>

        {user ? (
          <div className="text-center">
            <p className="text-xl mb-4">Välkommen, {user.email}!</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mb-4"
            >
              Logga ut
            </button>

            {/* Träningslogg */}
            <AddWorkout user={user} onWorkoutAdded={() => window.location.reload()} />
            <WorkoutList />
          </div>
        ) : (
          <p className="text-center">Laddar...</p>
        )}
      </div>
    </div>
  );
}
