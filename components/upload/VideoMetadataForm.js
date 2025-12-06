// VideoMetadataForm Component - Form for video metadata

import { useState } from 'react';
import Input from '../ui/Input';
import { Select, Textarea } from '../ui/Input';
import Button from '../ui/Button';

export default function VideoMetadataForm({
  athletes = [],
  onSubmit,
  isLoading = false,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    athlete_id: initialData.athlete_id || '',
    run_date: initialData.run_date || new Date().toISOString().split('T')[0],
    location: initialData.location || '',
    discipline: initialData.discipline || '',
    notes: initialData.notes || '',
  });

  const disciplines = [
    { value: 'slalom', label: 'Slalom' },
    { value: 'giant_slalom', label: 'Giant Slalom' },
    { value: 'super_g', label: 'Super-G' },
    { value: 'downhill', label: 'Downhill' },
    { value: 'combined', label: 'Combined' },
    { value: 'training', label: 'Training' },
  ];

  const locations = [
    'Åre',
    'Sälen',
    'Trysil',
    'Hemsedal',
    'Zermatt',
    'St. Moritz',
    'Other',
  ];

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Video Title"
        placeholder="e.g., Slalom Run 1 - Morning Session"
        value={formData.title}
        onChange={handleChange('title')}
        required
      />

      {/* Athlete & Date Row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Athlete"
          value={formData.athlete_id}
          onChange={handleChange('athlete_id')}
          options={athletes.map((a) => ({
            value: a.id,
            label: a.full_name,
          }))}
          placeholder="Select athlete..."
        />

        <Input
          label="Run Date"
          type="date"
          value={formData.run_date}
          onChange={handleChange('run_date')}
        />
      </div>

      {/* Location & Discipline Row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Location</label>
          <input
            type="text"
            list="locations"
            className="input"
            placeholder="Where was this recorded?"
            value={formData.location}
            onChange={handleChange('location')}
          />
          <datalist id="locations">
            {locations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        <Select
          label="Discipline"
          value={formData.discipline}
          onChange={handleChange('discipline')}
          options={disciplines}
          placeholder="Select discipline..."
        />
      </div>

      {/* Notes */}
      <Textarea
        label="Notes (optional)"
        placeholder="Any additional notes about this run..."
        value={formData.notes}
        onChange={handleChange('notes')}
        rows={3}
      />

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" variant="primary" loading={isLoading}>
          {isLoading ? 'Saving...' : 'Save Video'}
        </Button>
      </div>
    </form>
  );
}
