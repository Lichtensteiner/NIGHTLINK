export type UserRole = 'employee' | 'employer' | 'admin';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  rating: number;
  city?: string;
  country?: string;
  verified: boolean;
  profile_photo?: string;
  created_at: string;
}

export interface Establishment {
  id: string;
  name: string;
  type: 'bar' | 'club' | 'lounge' | 'snack-bar' | 'restaurant';
  address: string;
  city: string;
  country: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  contract_type: string;
  status: 'open' | 'closed';
  establishment_id: string;
  created_at: string;
  establishment?: Establishment;
}

export interface Mission {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  employee_id?: string;
  establishment_id: string;
  created_at: string;
  establishment?: Establishment;
}
