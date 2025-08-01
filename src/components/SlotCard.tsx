import React from 'react';
import { Slot } from '../types';
import axios from 'axios';
interface Props {
  slot: Slot;
  onUpdate?: () => void;
}

export default function SlotCard({ slot, onUpdate }: Readonly<Props>) {
  let color = 'bg-yellow-100';
  if (slot.status === 'Available') color = 'bg-green-100';
  else if (slot.status === 'Occupied') color = 'bg-red-100';

  const toggleMaintenance = async () => {
    const newStatus = slot.status === 'Maintenance' ? 'Available' : 'Maintenance';

    await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
      status: newStatus,
     }).then(() => {
      if (onUpdate) onUpdate();
    });
  }

  return (
    <div className={`p-3 rounded shadow ${color}`}>
      <h3 className="font-semibold">{slot.number}</h3>
      <p>Type: {slot.type}</p>
      <p>Status: {slot.status}</p>
      {slot.assignedTo && <p>Vehicle: {slot.assignedTo}</p>}

      <button
        className="mt-2 text-sm bg-yellow-400 px-2 py-1 rounded"
        onClick={toggleMaintenance}
      >
        {slot.status === 'Maintenance' ? 'Restore Slot' : 'Mark Maintenance'}
      </button>
    </div>
  );
}
