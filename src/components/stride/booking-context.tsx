import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = { open: boolean; openModal: () => void; closeModal: () => void };
const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal]);
  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) return { open: false, openModal: () => {}, closeModal: () => {} };
  return ctx;
}
