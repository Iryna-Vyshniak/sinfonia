import {  useContext } from "react";
import { TicketOffcanvasContext } from './TicketOffcanvasContext';

export function useTicketOffcanvas() {
  const context = useContext(TicketOffcanvasContext);

  if (!context) {
    throw new Error(
      'useTicketOffcanvas must be used within a TicketOffcanvasProvider'
    );
  }

  return context;
}