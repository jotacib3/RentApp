import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ClientReserv } from 'src/app/models/client-reserv';
import { Subscription } from 'rxjs';
import { ClientsReservsService } from 'src/app/services/clients-reservs.service';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ClientsService } from 'src/app/services/clients.service';
import { Client } from 'src/app/models/client';
import { ReservsService } from 'src/app/services/reservs.service';
import { Reserv } from 'src/app/models/reserv';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {

  clientsreservs: ClientReserv[] = [];
  countries: Country[] = [];
  clients: Client[] = [];
  reservs: Reserv[] = [];
  items: {name : string, value: number}[] = [];
  private clientreservsSub: Subscription;
  private countriesSub: Subscription;
  private clientsSub: Subscription;
  private reservesSub: Subscription;
  // Best country by date range
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-blue' });
  countryFrecuenc = new Map<string, number>();
  countryBest = new Map<string, number>();
  value = 0;

  code = '';
  clientreservDetail: ClientReserv;
  month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Client by date range
  clientsFrecuenc = new Map<string, number>();
  clientBest = new Map<string, number>();
  clientValue = 0;
  clientsbsRangeValue: Date[];

  // 25 best client
  bestclientsFrecuenc = new Map<string, number>();
  bestclientBest = new Map<string, number>();
  bestclientValue = 0;
  bestclientsbsRangeValue: Date[];

  // Reservation per client
  clientsReservsTime: ClientReserv[] = [];
  clientReservTimeId: number = null;

  client: Client;

  constructor( private clientreservsService: ClientsReservsService, private countriesService: CountriesService,
               private clientsService: ClientsService, private reservsService: ReservsService) {
    this.bsValue.setFullYear(this.bsValue.getFullYear() - 1);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.clientsbsRangeValue = [this.bsValue, this.maxDate];
   }

  ngOnInit() {
    this.reservsService.getReservs();
    this.reservesSub = this.reservsService.getReservsUpdateListener()
      .subscribe((reservs: Reserv[]) => {
        this.reservs = reservs;
        this.reservasPorMes();
      });
    this.clientreservsService.getClientReservs();
    this.clientreservsSub = this.clientreservsService.getClientReservsUpdateListener()
      .subscribe((clientreservs: ClientReserv[]) => {
        this.clientsreservs = clientreservs;
        this.bestsclients();        
        this.clientRangedatepicker();
      });
    this.countriesService.getCountries();
    this.countriesSub = this.countriesService.getCountriesUpdateListener()
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        this.paisQueMasEmite();
      });
    this.clientsService.getClients();
    this.clientsSub = this.clientsService.getClientsUpdateListener()
      .subscribe((clients: Client[]) => {
        this.clients = clients;
        this.clientsReservsTimes();
        this.clientRangedatepicker();
        this.bestsclients();
      });
  }

  ngOnDestroy() {
    this.clientreservsSub.unsubscribe();
    this.reservesSub.unsubscribe();
    this.clientsSub.unsubscribe();
    this.countriesSub.unsubscribe();
  }

  reservasPorMes() {
    this.month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const length = this.reservs.length;
    for (let i = 0; i < length; i++) {
      this.month[new Date(this.reservs[i].checkIn).getMonth()]++;
    }
  }

  paisQueMasEmite() {
    const length = this.countries.length;
    for (let i = 0; i < length; i++) {
      this.countryFrecuenc.set(this.countries[i].name, 0);
    }
    this.countryBest.clear();
    const lengthClient = this.clientsreservs.length;
    for (let i = 0; i < lengthClient; i++) {
      if (!(new Date(this.clientsreservs[i].reserv.checkIn) > this.bsRangeValue[1] ||
          new Date(this.clientsreservs[i].reserv.checkOut) < this.bsRangeValue[0])) {
        let temp = this.countryFrecuenc.get(this.clientsreservs[i].client.country.name);
        temp++;
        if (this.value < temp) {
          this.value = temp;
        }
        this.countryFrecuenc.set(this.clientsreservs[i].client.country.name, temp);
      }
    }

    if (this.value > 0) {
      for (const [key, value] of this.countryFrecuenc) {
        if (value === this.value) {
          this.countryBest.set(key, value);
        }
      }
    }
  }

  clientsReservsDetails() {
    this.clientreservDetail = this.clientsreservs.find(c => c.code === this.code);
  }

  clientsReservsTimes() {
    const id = this.clientReservTimeId;
    if (id !== null) {
      this.clientsReservsTime = this.clientsreservs.filter(c => c.clientId.toString() === id.toString());
    }

  }

  clientRangedatepicker() {
    const length = this.clients.length;
    for (let i = 0; i < length; i++) {
      this.clientsFrecuenc.set(this.clients[i].name, 0);
    }
    this.clientBest.clear();
    const lengthClient = this.clientsreservs.length;
    for (let i = 0; i < lengthClient; i++) {
      if (!(new Date(this.clientsreservs[i].reserv.checkIn) > this.clientsbsRangeValue[1] ||
          new Date(this.clientsreservs[i].reserv.checkOut) < this.clientsbsRangeValue[0])) {
        let temp = this.clientsFrecuenc.get(this.clientsreservs[i].client.name);
        // if (this.clientsreservs[i].client.name === 'Digna Rosa') {
        //   console.log(temp);
        // }
        temp++;
        if (this.clientValue < temp) {
          this.clientValue = temp;
        }
        this.clientsFrecuenc.set(this.clientsreservs[i].client.name, temp);
      }
    }
  }

  bestsclients() {
    const length = this.clients.length;
    const  bestclientBest = new Map<string, number>();
    for (let i = 0; i < length; i++) {
        bestclientBest.set(this.clients[i].id.toString(), 0);
    }
    this.bestclientBest.clear();
    const lengthClient = this.clientsreservs.length;
    for (let i = 0; i < lengthClient; i++) {
        let temp: number = bestclientBest.get(this.clientsreservs[i].client.id.toString());
        temp ++;
        bestclientBest.set(this.clientsreservs[i].client.id.toString(), temp);
    }
    const count = bestclientBest.size < 25 ? bestclientBest.size : 25;
    this.items = [];

    for (let i = 0; i < count; i++) {
        let bestvalue = -1;
        let bestkey = '';
        for (const [key, value] of bestclientBest) {
          if (value > bestvalue) {
            bestvalue = value;
            bestkey = key;
          }
        }
        const client = this.clientsService.getClient(bestkey);
        this.items.push({name: client.name + ' ' + client.lastName, value: bestvalue});
        bestclientBest.delete(bestkey);
    }
  }
}
