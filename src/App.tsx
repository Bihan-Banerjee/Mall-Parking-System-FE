import { useState, useEffect } from 'react';
import VehicleForm from './components/VehicleForm';
import SlotDashboard from './components/SlotDashboard';
import { Slot, SlotStatus, SlotType, VehicleType } from './types';
import axios from 'axios';
import AddSlotForm from './components/AddSlotForm';

const typeToSlotMap: Record<VehicleType, SlotType[]> = {
  Car: ['Regular', 'Compact'],
  Bike: ['Bike'],
  EV: ['EV'],
  Handicap: ['Accessible'],
};

const normalizeSlot = (s: any): Slot => ({
  id: s._id || s.id,
  number: s.number,
  type: s.type as SlotType,
  assignedTo: s.assignedTo || '',
  status: s.status as SlotStatus,
  entryTime: s.entryTime ? new Date(s.entryTime) : undefined,
  exitTime: s.exitTime ? new Date(s.exitTime) : undefined,
});

function App() {
  const [slots, setSlots] = useState<Slot[]>([]);

  const fetchSlots = () => {
    axios.get('http://localhost:5000/api/slots')
      .then(res => {
        const parsed: Slot[] = res.data.map(normalizeSlot);
        setSlots(parsed);
      })
      .catch(err => console.error('Failed to fetch slots:', err));
  };

  useEffect(fetchSlots, []);

  const addVehicle = async (plate: string, type: VehicleType, overrideSlotId?: string) => {
    try {
      let selectedSlot: Slot | undefined;

      if (overrideSlotId) {
        selectedSlot = slots.find(s => s.id === overrideSlotId);
      } else {
        const validTypes = typeToSlotMap[type];
        selectedSlot = slots.find(
          s => s.status === 'Available' && validTypes.includes(s.type)
        );
      }

      if (!selectedSlot) {
        alert('No available slot found for this type.');
        return;
      }

      await axios.patch(`http://localhost:5000/api/slots/${selectedSlot.id}`, {
        assignedTo: plate,
        status: 'Occupied',
        entryTime: new Date(),
      });

      fetchSlots();
    } catch (err) {
      console.error('Failed to assign vehicle:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700">Mall Parking System</h1>

        <div className="grid grid-cols-1 gap-6">
          <AddSlotForm onAdd={fetchSlots} />
          <VehicleForm onAdd={addVehicle} slots={slots} />
        </div>

        <SlotDashboard slots={slots} onUpdate={fetchSlots} />
      </div>
    </div>

  );
}

export default App;
