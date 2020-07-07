import { Component, OnInit, OnDestroy, TemplateRef, EventEmitter, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Client } from 'src/app/models/client';
import { Subscription } from 'rxjs';
import { ClientsService } from 'src/app/services/clients.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {

  client: Client;
  modalRef: BsModalRef;
  clients: Client[] = [];
  filtersClients: Client[] = [];
  countries: Country[] = [];
  clientsPagination: Client[] = [];
  startItem = 0;
  currentPage = 1;
  endItem = 10;
  search: string = '';
  private clientsSub: Subscription; 
  private countriesSub: Subscription;
  private properties: string[] = [];
  filter: Map<string,boolean> = new Map<string,boolean>();
  op: Map<[string, boolean], (a: Client, b: Client) => number> = new Map<[string, boolean], (a: Client, b: Client) => number>();
  max = 5;
  isReadonly = true;

  constructor(private modalService: BsModalService, private clientsService: ClientsService, private countriesService: CountriesService) {
    this.filter.set('name', null);
    this.filter.set('lastName', null);
    this.filter.set('CI', null);
    this.filter.set('country', null);
    this.op.set(['name', true], this.sortName);
    this.op.set(['name', false], (a: Client, b: Client) => -1*this.sortName(a,b))
    this.op.set(['lastName', true], this.sortLastName);
    this.op.set(['lastName', false], (a: Client, b: Client) => -1*this.sortLastName(a,b))
    this.op.set(['CI', true], this.sortCI);
    this.op.set(['CI', false], (a: Client, b: Client) => -1*this.sortCI(a,b))
    this.op.set(['country', true], this.sortCountry);
    this.op.set(['country', false], (a: Client, b: Client) => -1*this.sortCountry(a,b));
  }

  ngOnInit() {
    this.countriesService.getCountries();
    this.countriesSub = this.countriesService.getCountriesUpdateListener()
      .subscribe((countries: Country[]) => {
        this.countries = countries;
      });
    this.clientsService.getClients();
    this.clientsSub = this.clientsService.getClientsUpdateListener()
      .subscribe((clients: Client[]) => {
        this.clients = clients;
        this.filtersClients = this.filters();
        this.orderByClient();
        if ((this.currentPage - 1) * 10 === this.clients.length) {
          this.currentPage = Math.max(this.currentPage - 1, 1);
        }
        this.startItem = (this.currentPage - 1) * 10;
        this.endItem = this.currentPage * 10;
        this.clientsPagination = this.filtersClients.slice(this.startItem, this.endItem);
      });
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  pageChanged(event: PageChangedEvent): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.clientsPagination = this.filtersClients.slice(this.startItem, this.endItem);
  }

  deleteClient(id: number) {
    this.clientsService.deleteClient(id);
  }

  filters() {
    return this.clients.filter(c => c.ci.toLowerCase().startsWith(this.search.toLowerCase()) ||
                                            c.name.toLowerCase().startsWith(this.search.toLowerCase()) ||
                                            c.lastName.toLowerCase().startsWith(this.search.toLowerCase()) || 
                                            c.country.name.toLowerCase().startsWith(this.search.toLowerCase()));    
  }

  filterChange() {
    this.startItem = 0;
    this.currentPage = 1;
    this.endItem = 10;
    this.filtersClients = this.filters();
    this.orderByClient();
    this.clientsPagination = this.filtersClients.slice(this.startItem, this.endItem);
  }

  orderBy(property: string) {
    const value = this.filter.get(property);
    this.properties = this.properties.filter(val => val !== property);
    this.properties.push(property);
    if (value === null) {
      this.filter.set(property, true);
    } else {
      const value =  !this.filter.get(property);
      this.filter.set(property, value);
    }
    this.orderByClient();
    this.clientsPagination = this.filtersClients.slice(this.startItem, this.endItem); 
  }

  printArrow(property: string): string {
    return this.filter.get(property) ? 'assets/up-arrow.png' : 'assets/down-arrow.png'
  }

  orderByClient() {
    // console.log(this.properties);
    const propertiesLength = this.properties.length;
    // for (let i = 0; i < propertiesLength; i++) {
    //   if (this.filter.get(this.properties[i]) !== null && this.filter.get(this.properties[i])) {
    //     const key: [string, boolean] = ['name', true];
    //     console.log(key);
    //     const opTrue = this.op.get(key);
    //     this.clients = this.clients.sort(opTrue);
    //   } else {
    //       const opFalse = this.op.get([this.properties[i], false]);
    //       this.clients = this.clients.sort(opFalse);
    //   }
    // }
    // console.log('variant win');
    for (let i = 0; i < propertiesLength; i++) {
      for (const [key, value] of this.op) {
        if (key[0] === this.properties[i]) {
          const cmp = this.filter.get(key[0])
          if ( cmp !== null && cmp === key[1]) {
            this.filtersClients = this.filtersClients.sort(this.op.get(key));
          }
        }        
      }
    }
  }
  sortName(a: Client, b:Client) {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  }

  sortLastName(a: Client, b:Client) {
    return a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1;
  }

  sortCountry(a: Client, b:Client) {
    return a.country.name.toLowerCase() > b.country.name.toLowerCase() ? 1 : -1;
  }

  sortCI(a: Client, b:Client) {
    return a.ci.toLowerCase() > b.ci.toLowerCase() ? 1 : -1;
  }

}

