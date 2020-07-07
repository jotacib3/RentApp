import { Country } from './country';
import { ClientReserv } from './client-reserv';

export interface Client {
    id: number;
    name: string;
    lastName: string;
    ci: string;
    countryId: number;

    country: Country;
}
