import { Client } from './client';
import { Reserv } from './reserv';

export interface ClientReserv {
    id: number;
    clientId: number;
    reservId: number;
    code: string;

    client: Client;
    reserv: Reserv;
}

export interface ViewClientReserv {
    clientId: number;
    code: string;
}
