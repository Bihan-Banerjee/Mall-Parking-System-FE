import React from 'react';
import { Slot } from '../types';

// Define Props interface explicitly
interface Props {
  slot: Slot;
}

export default function SlotCard({ slot }: Props) {
  // Extract color based on slot status (cleaner ternary split for readability)
  let color = 'bg-yellow-100'; // Default for Maintenance
  if (slot.status === 'Available') color = 'bg-green-100';
  else if (slot.status === 'Occupied') color = 'bg-red-100';

  return (
    <div className={`p-3 rounded shadow ${color}`}>
      <h3 className="font-semibold">{slot.number}</h3>
      <p>Type: {slot.type}</p>
      <p>Status: {slot.status}</p>
      {slot.assignedTo && <p>Vehicle: {slot.assignedTo}</p>}
    </div>
  );
}
