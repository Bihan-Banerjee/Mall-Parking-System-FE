import { Slot } from '../types';
import SlotCard from './SlotCard';
import { useState } from 'react';
interface Props {
  slots: Slot[];
  onUpdate: () => void;
}

export default function SlotDashboard({ slots, onUpdate }: Readonly<Props>) {
  const total = slots.length;
  const free = slots.filter(s => s.status === 'Available').length;
  const occupied = slots.filter(s => s.status === 'Occupied').length;
  const maintenance = slots.filter(s => s.status === 'Maintenance').length;
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = slots.filter((s) => {
    if (typeFilter !== 'All' && s.type !== typeFilter) return false;
    if (searchQuery && !s.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: slots.length,
    available: slots.filter((s) => s.status === 'Available').length,
    occupied: slots.filter((s) => s.status === 'Occupied').length,
    maintenance: slots.filter((s) => s.status === 'Maintenance').length,
  };
  return (
    <div className="mt-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-4 text-center">
        <div className="bg-gray-200 p-3 rounded">Total: {stats.total}</div>
        <div className="bg-green-200 p-3 rounded">Available: {stats.available}</div>
        <div className="bg-red-200 p-3 rounded">Occupied: {stats.occupied}</div>
        <div className="bg-yellow-200 p-3 rounded">Maintenance: {stats.maintenance}</div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="All">All Types</option>
          <option value="Regular">Regular</option>
          <option value="Compact">Compact</option>
          <option value="Bike">Bike</option>
          <option value="EV">EV</option>
          <option value="Accessible">Accessible</option>
        </select>

        <input
          type="text"
          placeholder="Search by plate..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-2">Slot Dashboard</h2>
      <div className="mb-4 flex gap-4">
        <span>Total: {total}</span>
        <span>Free: {free}</span>
        <span>Occupied: {occupied}</span>
        <span>Maintenance: {maintenance}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {slots.map((slot: Slot) => (
            <SlotCard key={slot.id} slot={slot} onUpdate={onUpdate}/>
        ))}
      </div>
    </div>
  );
}
