export interface RemoveBookingResponse {
    message: string;
    data: {
      linkFormularioId: number;
      formularioId: number;
      reservaId: number;
      facturaId: number;
    };
}