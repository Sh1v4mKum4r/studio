import type { User, Doctor, HealthStat, Appointment, Reminder } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';
import { subDays, format, addDays } from 'date-fns';

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');
const doctorAvatar1 = PlaceHolderImages.find(img => img.id === 'doctor-avatar-1');
const doctorAvatar2 = PlaceHolderImages.find(img => img.id === 'doctor-avatar-2');

export const mockUser: User = {
  userId: 'user123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatarUrl: userAvatar?.imageUrl || '',
  imageHint: userAvatar?.imageHint || '',
  assignedDoctorId: 'doc456',
};

export const mockDoctors: Doctor[] = [
  {
    doctorId: 'doc456',
    name: 'Dr. Emily Carter',
    specialty: 'Obstetrics & Gynecology',
    avatarUrl: doctorAvatar1?.imageUrl || '',
    imageHint: doctorAvatar1?.imageHint || ''
  },
  {
    doctorId: 'doc789',
    name: 'Dr. John Matthews',
    specialty: 'Cardiology',
    avatarUrl: doctorAvatar2?.imageUrl || '',
    imageHint: doctorAvatar2?.imageHint || ''
  },
];

export const mockHealthStats: HealthStat[] = Array.from({ length: 15 }, (_, i) => ({
  statId: `stat${i}`,
  userId: 'user123',
  timestamp: subDays(new Date(), 14 - i).toISOString(),
  bloodPressure: {
    systolic: 115 + Math.floor(Math.random() * 10),
    diastolic: 75 + Math.floor(Math.random() * 5),
  },
  sugarLevel: 80 + Math.floor(Math.random() * 20),
  weight: 65 + i * 0.2,
  heartRate: 70 + Math.floor(Math.random() * 10),
})).concat([
  {
    statId: 'statWarning',
    userId: 'user123',
    timestamp: subDays(new Date(), 0).toISOString(),
    bloodPressure: { systolic: 145, diastolic: 92 },
    sugarLevel: 185,
    weight: 68,
    heartRate: 88,
    alertLevel: 'warning',
  }
]);

export const mockAppointments: Appointment[] = [
  {
    apptId: 'appt1',
    userId: 'user123',
    doctorId: 'doc456',
    date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    time: '10:00 AM',
    reason: '20-week ultrasound',
    status: 'confirmed',
  },
  {
    apptId: 'appt2',
    userId: 'user123',
    doctorId: 'doc456',
    date: format(addDays(new Date(), 21), 'yyyy-MM-dd'),
    time: '02:30 PM',
    reason: 'Monthly check-up',
    status: 'confirmed',
  },
    {
    apptId: 'appt3',
    userId: 'user123',
    doctorId: 'doc789',
    date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    time: '11:00 AM',
    reason: 'Cardiology consultation',
    status: 'pending',
  },
];

export const mockReminders: Reminder[] = [
  {
    remId: 'rem1',
    userId: 'user123',
    title: 'Prenatal Vitamins',
    time: '08:00 AM',
    type: 'medication',
  },
  {
    remId: 'rem2',
    userId: 'user122',
    title: 'Folic Acid',
    time: '08:00 AM',
    type: 'medication',
  },
  {
    remId: 'rem3',
    userId: 'user123',
    title: 'Tetanus Vaccine',
    time: 'Next appointment',
    type: 'vaccination',
  },
];
