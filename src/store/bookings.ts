import { create } from "zustand";
import type { Booking, BookingStatus } from "@/types/booking";

const SERVICES = [
  "Hair Cut",
  "Spa Treatment",
  "Dental Checkup",
  "Consulting Session",
  "Massage Therapy",
  "Skin Care",
];

const NAMES = [
  "Nguyen Van An", "Tran Thi Bich", "Le Hoang Nam", "Pham Minh Tu",
  "Hoang Thi Lan", "Vu Quoc Bao", "Do Phuong Thao", "Bui Tien Dung",
  "Dang Hoai Nam", "Ngo Thuy Linh", "Phan Anh Duc", "Trinh Mai Anh",
  "Ly Quang Huy", "Mai Thi Hoa", "Truong Van Khoa", "Cao Thi Yen",
];

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

function pad(n: number) { return n.toString().padStart(2, "0"); }

function fmt(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function seedBookings(): Booking[] {
  const today = new Date();
  const list: Booking[] = [];
  for (let i = 0; i < 24; i++) {
    const offset = Math.floor(Math.random() * 14) - 5;
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const hour = 8 + Math.floor(Math.random() * 10);
    const min = Math.random() > 0.5 ? "00" : "30";
    const name = NAMES[i % NAMES.length];
    list.push({
      id: `BK-${(1000 + i).toString()}`,
      customerName: name,
      phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
      service: SERVICES[i % SERVICES.length],
      date: fmt(d),
      time: `${pad(hour)}:${min}`,
      status: STATUSES[i % STATUSES.length],
      notes: i % 3 === 0 ? "Customer requested a window seat." : undefined,
      createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
    });
  }
  return list.sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
}

interface BookingStore {
  bookings: Booking[];
  add: (b: Omit<Booking, "id" | "createdAt" | "status"> & { status?: BookingStatus }) => Booking;
  update: (id: string, patch: Partial<Booking>) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: BookingStatus) => void;
}

export const useBookings = create<BookingStore>((set, get) => ({
  bookings: seedBookings(),
  add: (b) => {
    const created: Booking = {
      ...b,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: b.status ?? "pending",
      createdAt: new Date().toISOString(),
    };
    set({ bookings: [created, ...get().bookings] });
    return created;
  },
  update: (id, patch) => set({
    bookings: get().bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
  }),
  remove: (id) => set({ bookings: get().bookings.filter((b) => b.id !== id) }),
  setStatus: (id, status) => set({
    bookings: get().bookings.map((b) => (b.id === id ? { ...b, status } : b)),
  }),
}));

export const SERVICE_OPTIONS = SERVICES;
