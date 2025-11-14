export type User = {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  imageHint: string;
  assignedDoctorId: string;
};

export type Doctor = {
  doctorId: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  imageHint: string;
};

export type HealthStat = {
  statId: string;
  userId: string;
  timestamp: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  sugarLevel: number;
  weight: number;
  heartRate: number;
  alertLevel?: 'critical' | 'warning' | 'normal';
};

export type Appointment = {
  apptId: string;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

export type Reminder = {
  remId: string;
  userId:string;
  title: string;
  time: string;
  type: 'medication' | 'vaccination';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
