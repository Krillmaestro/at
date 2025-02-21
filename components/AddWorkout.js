import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function AddWorkout({ user, onWorkoutAdded }) {
  const [workout, setWorkout] = useState('');
  const [message, setMessage] = useState('');

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('Ingen användare inloggad ❌');
      return;
    }

    const { data, error } = await supabase
      .from('workouts')
      .insert([{ workout, user_id: user.id, created_at: new Date() }]);

    if (error) {
      console.error('Supabase Error:', error);
      setMessage('Något gick fel! ❌');
    } else {
      setMessage('Träningspass sparat! ✅');
      setWorkout('');
      onWorkoutAdded();
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold">Logga Träning</h2>
      <form onSubmit={handleAddWorkout}>
        <input
          type="text"
          placeholder="Ex. 5km löpning, 3x10 bänkpress"
          value={workout}
          onChange={(e) => setWorkout(e.target.value)}
          className="w-full p-2 border rounded mt-2"
          required
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Spara pass
        </button>
      </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
