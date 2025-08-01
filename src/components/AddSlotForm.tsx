import { useState } from 'react';
import axios from 'axios';
import { SlotType } from '../types';

interface Props {
  onAdd: () => void;
}

const slotTypes: SlotType[] = ['Regular', 'Compact', 'Bike', 'EV', 'Accessible'];

export default function AddSlotForm({ onAdd }: Readonly<Props>) {
  const [number, setNumber] = useState('');
  const [type, setType] = useState<SlotType>('Regular');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    await axios.post('http://localhost:5000/api/slots', {
      number,
      type,
      status: 'Available',
      assignedTo: ''
    });

    setNumber('');
    setType('Regular');
    onAdd(); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mb-4">
      <div>
        <label className="block text-sm">Slot Number</label>
        <input
          className="border rounded px-2 py-1"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Type</label>
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value as SlotType)}
        >
          {slotTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
        Add Slot
      </button>
    </form>
  );
}
