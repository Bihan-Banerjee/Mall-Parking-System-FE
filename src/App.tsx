import { useState, useEffect } from 'react';
import VehicleForm from './components/VehicleForm';
import SlotDashboard from './components/SlotDashboard';
import { initialSlots } from './data/mockSlots';
import { Slot, SlotStatus, SlotType, VehicleType } from './types';
import axios from 'axios';
import AddSlotForm from './components/AddSlotForm';
const typeToSlotMap: Record<VehicleType, Slot['type'][]> = {
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
  status: s.status as SlotStatus 
});

function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
   useEffect(() => {
  axios.get('http://localhost:5000/api/slots')
    .then(res => {
      const parsedSlots: Slot[] = res.data.map(normalizeSlot);
      setSlots(parsedSlots); 
    })
    .catch(err => console.error(err));
}, []);

  const fetchSlots = () => {
  axios.get('http://localhost:5000/api/slots')
    .then(res => {
      const parsed: Slot[] = res.data.map(normalizeSlot);
      setSlots(parsed);
    });
};

useEffect(fetchSlots, []);

  const addVehicle = async (plate: string, type: VehicleType) => {
  try {
    const slotTypeMap: Record<VehicleType, Slot['type']> = {
    Car: 'Regular',
    Bike: 'Bike',
    EV: 'EV',
    Handicap: 'Accessible'
  };

    const mappedType = slotTypeMap[type];

    const availableSlot = slots.find(s => s.status === 'Available' && s.type === mappedType);

    if (!availableSlot) {
      alert('No available slot for this type');
      return;
    }

    await axios.patch(`http://localhost:5000/api/slots/${availableSlot.id}`, {
      assignedTo: plate,
      status: 'Occupied',
      entryTime: new Date(), // ✅ This is where you add the entryTime
    });

    fetchSlots(); // Refresh after update
  } catch (err) {
    console.error('Failed to assign vehicle:', err);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mall Parking System</h1>
      <AddSlotForm onAdd={fetchSlots} />
      <VehicleForm onAdd={addVehicle} />
      <SlotDashboard slots={slots} onUpdate={fetchSlots} />
    </div>
  );
}

export default App;
