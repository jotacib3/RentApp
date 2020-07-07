import { ClientReserv } from './client-reserv';

export interface Reserv {
    id: number;
    checkIn: Date;
    checkOut: Date;
    realPayment: number;
    fictionalPayment: number;
    reservationMethod: string;
    consume?: boolean;
    rating: number;

    clientsReserv: ClientReserv[];
}

