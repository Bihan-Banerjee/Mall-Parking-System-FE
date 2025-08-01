import { useState } from 'react';
import { VehicleType, Slot } from '../types';

interface Props {
  onAdd: (plate: string, type: VehicleType) => void;
}

export default function VehicleForm({ onAdd }: Props) {
  const [plate, setPlate] = useState('');
  const [type, setType] = useState<VehicleType>('Car');

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Vehicle Entry</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Number Plate"
        value={plate}
        onChange={(e) => setPlate(e.target.value.toUpperCase())}
      />
      <select className="border p-2 w-full mb-2" value={type} onChange={(e) => setType(e.target.value as VehicleType)}>
        <option>Car</option>
        <option>Bike</option>
        <option>EV</option>
        <option>Handicap</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          if (plate) {
            onAdd(plate, type);
            setPlate('');
          }
        }}
      >
        Check In
      </button>
    </div>
  );
}
