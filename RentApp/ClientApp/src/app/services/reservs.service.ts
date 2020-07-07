import { Injectable } from '@angular/core';
import { Reserv } from '../models/reserv';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { ClientsService } from './clients.service';
import { ClientsReservsService } from './clients-reservs.service';
import { ViewClientReserv, ClientReserv } from '../models/client-reserv';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ReservsService {

  private reservs: Reserv[] = [];
  private reservsUpdated = new Subject<Reserv[]>();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService,
              private clientsService: ClientsService, private clientsReservsService: ClientsReservsService) { }

  getReservs() {
    this.http.get<Reserv[]>(`${this.envUrl.urlAddress}/reservs`)
    .subscribe((reservsData) => {
      this.reservs = reservsData;
      console.log(this.reservs);
      this.reservsUpdated.next([...this.reservs]);
    }, error => console.error(error));
  }

  getReservsUpdateListener() {
    return this.reservsUpdated.asObservable();
  }

  getReserv(id: string) {
    return {...this.reservs.find(r => r.id.toString() === id)};
  }

  addReserv(reserv: Reserv, clientsCode: ViewClientReserv[]) {
    this.http.post<Reserv>(`${this.envUrl.urlAddress}/reservs`, reserv, this.generateHeaders())
    .subscribe(reservData => {
      const id = reservData.id;
      reserv.id = id;

      const clientsReserv: ClientReserv[] = [];
      const clients: Client[] = [];
      const lengthClient = clientsCode.length;
      for (let i = 0; i < lengthClient; i++) {
        const client = this.clientsService.getClient(clientsCode[i].clientId.toString());
        clients.push(client);
        clientsReserv.push({
          id: 0,
          code: clientsCode[i].code,
          clientId: clientsCode[i].clientId,
          reservId: id,
          client: null,
          reserv: null
        });
      }
      this.clientsReservsService.addRangeClientReserv(clientsReserv, clients, reserv);
      reserv.clientsReserv = clientsReserv;
      this.reservs.push(reserv);
      this.reservsUpdated.next([...this.reservs]);
    }, error => console.error(error));
  }

  updateReserv(reserv: Reserv, clientsCode: ViewClientReserv[]) {
    this.http.put(`${this.envUrl.urlAddress}/reservs/${reserv.id}`, reserv, this.generateHeaders())
    .subscribe( response => {
      const updatedreservs = [...this.reservs];
      const id = reserv.id;

      const clientsReserv: ClientReserv[] = [];
      const clients: Client[] = [];
      const lengthClient = clientsCode.length;
      for (let i = 0; i < lengthClient; i++) {
        const client = this.clientsService.getClient(clientsCode[i].clientId.toString());
        clients.push(client);
        clientsReserv.push({
          id: 0,
          code: clientsCode[i].code,
          clientId: clientsCode[i].clientId,
          reservId: id,
          client: null,
          reserv: null
        });
      }
      if (lengthClient > 0) {

        this.clientsReservsService.addRangeClientReserv(clientsReserv, clients, reserv);
        const length = clientsReserv.length;
        for (let i = 0; i < length; i++) {
          reserv.clientsReserv.push(clientsReserv[i]);
        }
      }
      console.log(reserv.clientsReserv);
      const oldReservIndex = updatedreservs.findIndex(c => c.id === id);
      updatedreservs[oldReservIndex] = reserv;
      this.reservs = updatedreservs;
      this.reservsUpdated.next([...this.reservs]);
    }, error => console.error(error));
  }

  deleteReserv(reservId: number) {
    this.http.delete(`${this.envUrl.urlAddress}/reservs/${reservId}`)
    .subscribe( response => {
    const updatedReservs = this.reservs.filter(c => c.id !== reservId);
    this.reservs = updatedReservs;
    this.reservsUpdated.next([...this.reservs]);
    }, error => console.error(error));
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

}
