

import { useState, useCallback, type ReactNode,  } from "react";
import { type TourDetails, TicketOffcanvasContext } from "./TicketOffcanvasContext";

export function TicketOffcanvasProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourDetails | undefined>();

  const openOffcanvas = useCallback((tourDetails?: TourDetails) => {
    setSelectedTour(tourDetails);
    setIsOpen(true);
  }, []);

  const closeOffcanvas = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedTour(undefined);
    }, 300); 
  }, []);

  return (
    <TicketOffcanvasContext.Provider value={{ isOpen, selectedTour, openOffcanvas, closeOffcanvas }}>
      {children}
    </TicketOffcanvasContext.Provider>
  );
}
