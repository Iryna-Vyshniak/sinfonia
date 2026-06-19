import { createContext } from 'react';

export interface TourDetails {
  id: string;
  date: string;
  city: string;
  venue: string;
}

export interface TicketOffcanvasContextType {
  isOpen: boolean;
  selectedTour?: TourDetails;
  openOffcanvas: (tourDetails?: TourDetails) => void;
  closeOffcanvas: () => void;
}

export const TicketOffcanvasContext =
  createContext<TicketOffcanvasContextType | undefined>(undefined);





