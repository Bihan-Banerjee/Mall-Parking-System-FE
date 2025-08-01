import { useState, useEffect } from "react";
import VehicleForm from "./components/VehicleForm";
import SlotDashboard from "./components/SlotDashboard";
import { Slot, SlotStatus, SlotType, VehicleType } from "./types";
import axios from "axios";
import AddSlotForm from "./components/AddSlotForm";
import { WavyBackground } from "./components/ui/wavy-background";
import { MorphingText } from "./components/magicui/morphing-text";
const typeToSlotMap: Record<VehicleType, SlotType[]> = {
  Car: ["Regular", "Compact"],
  Bike: ["Bike"],
  EV: ["EV"],
  Handicap: ["Accessible"],
};

const normalizeSlot = (s: any): Slot => ({
  id: s._id || s.id,
  number: s.number,
  type: s.type as SlotType,
  assignedTo: s.assignedTo || "",
  status: s.status as SlotStatus,
  entryTime: s.entryTime ? new Date(s.entryTime) : undefined,
  exitTime: s.exitTime ? new Date(s.exitTime) : undefined,
});

function App() {
  const [slots, setSlots] = useState<Slot[]>([]);

  const fetchSlots = () => {
    axios
      .get("http://localhost:5000/api/slots")
      .then((res) => {
        const parsed: Slot[] = res.data.map(normalizeSlot);
        setSlots(parsed);
      })
      .catch((err) => console.error("Failed to fetch slots:", err));
  };

  useEffect(fetchSlots, []);

  const addVehicle = async (
    plate: string,
    type: VehicleType,
    overrideSlotId?: string
  ) => {
    try {
      let selectedSlot: Slot | undefined;

      const allowedTypes = typeToSlotMap[type];
      if (overrideSlotId) {
        selectedSlot = slots.find((s) => s.id === overrideSlotId);
        if (!selectedSlot || !allowedTypes.includes(selectedSlot.type)) {
          alert(`Cannot assign a ${type} to a ${selectedSlot?.type} slot.`);
          return;
        }
      } else {
        selectedSlot = slots.find(
          (s) => s.status === "Available" && allowedTypes.includes(s.type)
        );
      }

      if (!selectedSlot || selectedSlot.status !== "Available") {
        alert(
          `Slot is not available for assignment (status: ${selectedSlot?.status || "none"})`
        );
        return;
      }

      await axios.patch(`http://localhost:5000/api/slots/${selectedSlot.id}`, {
        assignedTo: plate,
        status: "Occupied",
        entryTime: new Date(),
      });

      fetchSlots();
    } catch (err) {
      console.error("Failed to assign vehicle:", err);
    }
  };

  return (
    <div className="relative min-h-screen text-black">
      {/* Fixed background */}
      <WavyBackground
        waveOpacity={0.2}
        backgroundFill="#0f172a"
        blur={10}
        speed="slow"
        colors={["#38bdf8", "#818cf8", "#22d3ee"]}
        containerClassName="fixed inset-0 w-full h-full z-0"
      />

      {/* Foreground Scrollable Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-6">
          <MorphingText texts={["MOTORQ", "Parking System"]} />
          <div className="grid grid-cols-1 gap-6">
            <AddSlotForm onAdd={fetchSlots} />
            <VehicleForm onAdd={addVehicle} slots={slots} />
          </div>
          <SlotDashboard slots={slots} onUpdate={fetchSlots} />
        </div>
      </div>
    </div>
  );
}

export default App;
