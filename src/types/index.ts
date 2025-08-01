export type VehicleType = 'Car' | 'Bike' | 'EV' | 'Handicap';

export interface Vehicle {
  id: string;
  numberPlate: string;
  type: VehicleType;
}

export type SlotStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Slot {
  id: string;
  number: string;
  type: 'Regular' | 'Compact' | 'Bike' | 'EV' | 'Accessible';
  status: SlotStatus;
  assignedTo?: string; 
}
