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

  const refresh = () => {
    if (onUpdate) onUpdate();
  };
  const toggleMaintenance = async () => {
    const newStatus = slot.status === 'Maintenance' ? 'Available' : 'Maintenance';

    await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
      status: newStatus,
     }).then(refresh);
  }

  const removeVehicle = async () => {
    await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
      assignedTo: '',
      status: 'Available',
    }).then(refresh);
  };

  const deleteSlot = async () => {
    if (confirm(`Are you sure you want to delete slot #${slot.number}?`)) {
      await axios.delete(`http://localhost:5000/api/slots/${slot.id}`)
        .then(refresh);
    }
  };

  const checkoutVehicle = async () => {
  const now = new Date();
  await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
    assignedTo: '',
    status: 'Available',
    exitTime: now
  }).then(refresh);
};

  return (
    <div className={`p-4 rounded shadow-md border ${color} transition-all`}>
      <h3 className="font-bold text-lg text-gray-800 mb-1">Slot #{slot.number}</h3>
      <p className="text-sm text-gray-600 mb-1">Type: <span className="font-medium">{slot.type}</span></p>
      <p className="text-sm text-gray-600 mb-1">Status: <span className="font-medium">{slot.status}</span></p>
      {slot.assignedTo && (
        <p className="text-sm text-blue-600 mb-2">Vehicle: {slot.assignedTo}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          className={`text-white text-sm px-3 py-1 rounded ${
            slot.status === 'Maintenance' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
          onClick={toggleMaintenance}
        >
          {slot.status === 'Maintenance' ? 'Restore Slot' : 'Mark Maintenance'}
        </button>

        {slot.assignedTo && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
            onClick={removeVehicle}
          >
            Remove Vehicle
          </button>
        )}

        {slot.assignedTo && (
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded"
            onClick={checkoutVehicle}
          >
            Checkout Vehicle
          </button>
        )}

        <button
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
          onClick={deleteSlot}
        >
          Delete Slot
        </button>
        {slot.entryTime && (
          <p className="text-xs text-gray-500">Checked in: {new Date(slot.entryTime).toLocaleString()}</p>
        )}
        {slot.exitTime && (
          <p className="text-xs text-gray-500">Checked out: {new Date(slot.exitTime).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
