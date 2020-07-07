import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private clients: Client[] = [];
  private clientsUpdated = new Subject<Client[]>();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {}

  getClients() {
    this.http.get<Client[]>(`${this.envUrl.urlAddress}/clients`)
    .subscribe((clientsData) => {
      this.clients = clientsData;
      this.clientsUpdated.next([...this.clients]);
    }, error => console.error(error));
  }

  getClientsUpdateListener() {
    return this.clientsUpdated.asObservable();
  }

  getClient(id: string) {
    return {...this.clients.find(r => r.id.toString() === id)};
  }

  addClient(client: Client, country: Country) {
    this.http.post<Client>(`${this.envUrl.urlAddress}/clients`, client, this.generateHeaders())
    .subscribe(clientData => {
      const id = clientData.id;
      client.id = id;
      client.country = country;
      this.clients.push(client);
      this.clientsUpdated.next([...this.clients]);
    }, error => console.error(error));
  }

  updateClient(client: Client, country: Country) {
    this.http.put(`${this.envUrl.urlAddress}/clients/${client.id}`, client, this.generateHeaders())
    .subscribe( response => {
      const updatedclients = [...this.clients];
      const id = client.id;
      client.country = country;
      const oldClientIndex = updatedclients.findIndex(c => c.id === id);
      updatedclients[oldClientIndex] = client;
      this.clients = updatedclients;
      this.clientsUpdated.next([...this.clients]);
    }, error => console.error(error));
  }

  deleteClient(clientId: number) {
    this.http.delete(`${this.envUrl.urlAddress}/clients/${clientId}`)
    .subscribe( response => {
    const updatedClients = this.clients.filter(c => c.id !== clientId);
    this.clients = updatedClients;
    this.clientsUpdated.next([...this.clients]);
    }, error => console.error(error));
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }


}
