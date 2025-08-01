import React, { useState } from 'react';
import { Slot } from '../types';
import axios from 'axios';

interface Props {
  slot: Slot;
  onUpdate?: () => void;
}

export default function SlotCard({ slot, onUpdate }: Readonly<Props>) {
  const [relocating, setRelocating] = useState(false);
  const [targetSlots, setTargetSlots] = useState<Slot[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  

  const refresh = () => {
    if (onUpdate) onUpdate();
  };

  const toggleMaintenance = async () => {
    const newStatus = slot.status === 'Maintenance' ? 'Available' : 'Maintenance';
    await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
      status: newStatus,
    });
    refresh();
  };

  const checkoutVehicle = async () => {
    const now = new Date();
    await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
      assignedTo: '',
      status: 'Available',
      exitTime: now,
    });
    refresh();
  };

  const deleteSlot = async () => {
    if (confirm(`Are you sure you want to delete slot #${slot.number}?`)) {
      await axios.delete(`http://localhost:5000/api/slots/${slot.id}`);
      refresh();
    }
  };

  const startRelocation = async () => {
    const res = await axios.get('http://localhost:5000/api/slots');
    const allSlots: Slot[] = res.data;

    const compatibleSlots = allSlots.filter(
      (s) =>
        s.status === 'Available' &&
        s.type === slot.type &&
        s.id !== slot.id
    );

    if (compatibleSlots.length === 0) {
      alert('No compatible slots available for relocation.');
      return;
    }

    setTargetSlots(
      compatibleSlots.map((s) => ({
        ...s,
        id: s._id || s.id, 
      }))
    );
    setRelocating(true);
  };

  const confirmRelocation = async () => {
    if (!selectedTarget) {
      alert('Please select a target slot.');
      return;
    }

    const vehicle = slot.assignedTo;
    if (!vehicle) {
      alert("Vehicle info missing.");
      return;
    }

    try {
      const assignResponse = await axios.patch(`http://localhost:5000/api/slots/${selectedTarget}`, {
        assignedTo: vehicle,
        status: 'Occupied',
        entryTime: new Date(),
      });

      if (assignResponse.status !== 200) {
        throw new Error('Failed to assign to target slot.');
      }

      const clearResponse = await axios.patch(`http://localhost:5000/api/slots/${slot.id}`, {
        assignedTo: '',
        status: 'Available',
        exitTime: new Date(),
      });

      if (clearResponse.status !== 200) {
        throw new Error('Failed to clear current slot.');
      }

      setRelocating(false);
      setSelectedTarget('');
      refresh();
    } catch (err) {
      console.error("Relocation error:", err);
      alert("Vehicle relocation failed.");
    }
  };


  return (
    <div className="rounded-lg shadow-md p-4 border bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80">
      <h3 className="font-bold text-lg text-gray-800 mb-1">Slot #{slot.number}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Type: <span className="font-medium">{slot.type}</span>
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Status: <span className="font-medium">{slot.status}</span>
      </p>
      {slot.assignedTo && (
        <p className="text-sm text-blue-600 mb-2">Vehicle: {slot.assignedTo}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          className={`text-white text-sm px-3 py-1 rounded ${
            slot.status === 'Maintenance'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
          onClick={toggleMaintenance}
        >
          {slot.status === 'Maintenance' ? 'Restore Slot' : 'Mark Maintenance'}
        </button>

        {slot.assignedTo && (
          relocating ? (
            <div className="flex flex-col gap-2 w-full">
              <select
                className="border p-1 rounded"
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
              >
                <option value="">Select target slot</option>
                {targetSlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.number} ({s.type})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  onClick={confirmRelocation}
                >
                  Confirm Relocation
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-3 py-1 rounded"
                  onClick={() => setRelocating(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
              onClick={startRelocation}
            >
              Relocate Vehicle
            </button>
          )
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
          <p className="text-xs text-gray-500">
            Checked in: {new Date(slot.entryTime).toLocaleString()}
          </p>
        )}
        {slot.exitTime && (
          <p className="text-xs text-gray-500">
            Checked out: {new Date(slot.exitTime).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
