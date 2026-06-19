import { createContext, useContext } from "react";
import type { TourDetails } from "./TicketOffcanvasContext";

interface TicketOffcanvasContextType {
  isOpen: boolean;
  selectedTour?: TourDetails;
  openOffcanvas: (tourDetails?: TourDetails) => void;
  closeOffcanvas: () => void;
}

export const TicketOffcanvasContext = createContext<TicketOffcanvasContextType | undefined>(undefined);

export function useTicketOffcanvas() {
  const context = useContext(TicketOffcanvasContext);
  if (!context) {
    throw new Error('useTicketOffcanvas must be used within a TicketOffcanvasProvider');
  }
  return context;
}