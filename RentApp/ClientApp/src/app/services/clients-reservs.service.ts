import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { Subject } from 'rxjs';
import { ClientReserv } from '../models/client-reserv';
import { EnvironmentUrlService } from './environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reserv } from '../models/reserv';

@Injectable({
  providedIn: 'root'
})
export class ClientsReservsService {

  private clientsreservs: ClientReserv[] = [];
  private clientsUpdated = new Subject<ClientReserv[]>();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  getClientReservs() {
    this.http.get<ClientReserv[]>(`${this.envUrl.urlAddress}/clientsreservs`)
    .subscribe((clientsreservsData) => {
      this.clientsreservs = clientsreservsData;
      this.clientsUpdated.next([...this.clientsreservs]);
    }, error => console.error(error));
  }

  getClientReservsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  getClientReserv(id: number) {
    return {...this.clientsreservs.find(r => r.id === id)};
  }

  addClientReserv(clientreserv: ClientReserv, client: Client, reserv: Reserv) {
    this.http.post<ClientReserv>(`${this.envUrl.urlAddress}/clientsreservs`, clientreserv, this.generateHeaders())
    .subscribe(clientData => {
      console.log(clientData);
      const id = clientData.id;
      clientreserv.id = id;
      clientreserv.client = client;
      clientreserv.reserv = reserv;
      this.clientsreservs.push(clientreserv);
      this.clientsUpdated.next([...this.clientsreservs]);
    }, error => console.error(error));
  }

  addRangeClientReserv(clientsreserv: ClientReserv[], clients: Client[], reserv: Reserv) {
    this.http.post<ClientReserv[]>(`${this.envUrl.urlAddress}/clientsreservs/range`, clientsreserv, this.generateHeaders())
    .subscribe(clientsreservsData => {
      const lengthClient = clientsreservsData.length;
      for (let i = 0; i < lengthClient; i++) {
          clientsreserv[i].id = clientsreservsData[i].id;
          clientsreserv[i].client = clients[i];
          clientsreserv[i].reserv = reserv;
          this.clientsreservs.push(clientsreserv[i]);
        }
      this.clientsUpdated.next([...this.clientsreservs]);
    }, error => console.error(error));
  }

  updateClientReserv(clientreserv: ClientReserv, client: Client, reserv: Reserv) {
    console.log(clientreserv);
    this.http.put(`${this.envUrl.urlAddress}/clientsreservs/${clientreserv.id}`, clientreserv, this.generateHeaders())
    .subscribe( response => {
      const updatedclients = [...this.clientsreservs];
      const id = clientreserv.id;
      clientreserv.client = client;
      clientreserv.reserv = reserv;
      const oldClientReservIndex = updatedclients.findIndex(c => c.id === id);
      updatedclients[oldClientReservIndex] = clientreserv;
      this.clientsreservs = updatedclients;
      this.clientsUpdated.next([...this.clientsreservs]);
    }, error => console.error(error));
  }

  deleteClientReserv(clientreservId: number) {
    this.http.delete(`${this.envUrl.urlAddress}/clientsreservs/${clientreservId}`)
    .subscribe( response => {
    const updatedClientReservs = this.clientsreservs.filter(c => c.id !== clientreservId);
    this.clientsreservs = updatedClientReservs;
    this.clientsUpdated.next([...this.clientsreservs]);
    }, error => console.error(error));
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

}
