'use client';

import { useState } from 'react';

interface Props {
  onSuccess: () => void; // Trigger refetch after successful POST
  onCoordsSelect?: (coords: [number, number]) => void; // Optional map-click support
  defaultCoords?: [number, number]; // Optional pre-fill coords
}

const types = [
  { value: 'construction-site', label: 'Construction Site' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'office', label: 'Office' },
  { value: 'disposal', label: 'Disposal' }
];

const LocationForm = ({ onSuccess, onCoordsSelect, defaultCoords }: Props) => {
  const [form, setForm] = useState({
    name: '',
    type: 'construction-site',
    address: '',
    lng: defaultCoords?.[0] || '',
    lat: defaultCoords?.[1] || '',
    carbonImpact: '',
    energyUsage: '',
    activeProjects: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          address: form.address,
          coordinates: [parseFloat(String(form.lng)), parseFloat(String(form.lat))],
          sustainabilityMetrics: {
            carbonImpact: parseFloat(form.carbonImpact),
            energyUsage: parseFloat(form.energyUsage)
          },
          activeProjects: parseInt(form.activeProjects)
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed');

      onSuccess();
      setForm({
        name: '',
        type: 'construction-site',
        address: '',
        lng: '',
        lat: '',
        carbonImpact: '',
        energyUsage: '',
        activeProjects: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={form.type}
          onChange={e => update('type', e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {types.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={e => update('address', e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input
            type="number"
            step="any"
            value={form.lng}
            onChange={e => update('lng', e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={e => update('lat', e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Carbon Impact (kg/day)</label>
          <input
            type="number"
            step="any"
            value={form.carbonImpact}
            onChange={e => update('carbonImpact', e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Energy Usage (MWh)</label>
          <input
            type="number"
            step="any"
            value={form.energyUsage}
            onChange={e => update('energyUsage', e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Active Projects</label>
        <input
          type="number"
          value={form.activeProjects}
          onChange={e => update('activeProjects', e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Adding...' : 'Add Location'}
      </button>
    </form>
  );
};

export default LocationForm;
