import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      let { data, error } = await supabase.from('workouts').select('*').order('created_at', { ascending: false });

      if (!error) {
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="mt-4 p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold">Tidigare träningspass</h2>
      <ul className="mt-2">
        {workouts.length === 0 ? (
          <p>Inga träningspass ännu.</p>
        ) : (
          workouts.map((workout) => (
            <li key={workout.id} className="mt-2 border-b pb-2">
              🏋️‍♂️ {workout.workout} <span className="text-gray-500">({new Date(workout.created_at).toLocaleDateString()})</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
