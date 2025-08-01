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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mall Parking System</h1>
      <AddSlotForm onAdd={fetchSlots} />
      <VehicleForm onAdd={addVehicle} slots={slots} />
      <SlotDashboard slots={slots} onUpdate={fetchSlots} />
    </div>
  );
}

export default App;
