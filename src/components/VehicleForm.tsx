import { useState } from 'react';
import { VehicleType, Slot } from '../types';

interface Props {
  readonly onAdd: (plate: string, type: VehicleType, overrideSlotId?: string) => void;
  readonly slots: Slot[];
}

export default function VehicleForm({ onAdd, slots }: Props) {
  const [plate, setPlate] = useState('');
  const [type, setType] = useState<VehicleType>('Car');
  const [overrideSlot, setOverrideSlot] = useState<string>('');

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Vehicle Entry</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Number Plate"
        value={plate}
        onChange={(e) => setPlate(e.target.value.toUpperCase())}
      />

      <select
        className="border p-2 w-full mb-2"
        value={type}
        onChange={(e) => setType(e.target.value as VehicleType)}
      >
        <option>Car</option>
        <option>Bike</option>
        <option>EV</option>
        <option>Handicap</option>
      </select>

      <select
        className="border p-2 w-full mb-2"
        value={overrideSlot}
        onChange={(e) => setOverrideSlot(e.target.value)}
      >
        <option value="">Optional: Manually select slot</option>
        {slots.map((slot: Slot) => (
          <option key={slot.id} value={slot.id}>
            #{slot.number} - {slot.type} ({slot.status})
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          if (plate) {
            onAdd(plate, type, overrideSlot || undefined);
            setPlate('');
            setOverrideSlot('');
          }
        }}
      >
        Check In
      </button>
    </div>
  );
}
