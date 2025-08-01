import { Slot } from '../types';
import SlotCard from './SlotCard';

interface Props {
  slots: Slot[];
}

export default function SlotDashboard({ slots }: Props) {
  const total = slots.length;
  const free = slots.filter(s => s.status === 'Available').length;
  const occupied = slots.filter(s => s.status === 'Occupied').length;
  const maintenance = slots.filter(s => s.status === 'Maintenance').length;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Slot Dashboard</h2>
      <div className="mb-4 flex gap-4">
        <span>Total: {total}</span>
        <span>Free: {free}</span>
        <span>Occupied: {occupied}</span>
        <span>Maintenance: {maintenance}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {slots.map((slot: Slot) => (
            <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
