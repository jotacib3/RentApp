import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { isNull } from 'util';
import { Reserv } from 'src/app/models/reserv';
import { NgForm } from '@angular/forms';
import { ReservsService } from 'src/app/services/reservs.service';
import { DatePipe } from '@angular/common';
import { ClientReserv, ViewClientReserv } from 'src/app/models/client-reserv';
import { Client } from 'src/app/models/client';
import { Subscription } from 'rxjs';
import { ClientsService } from 'src/app/services/clients.service';
import { ClientsReservsService } from 'src/app/services/clients-reservs.service';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';


@Component({
  selector: 'app-reserv-create',
  templateUrl: './reserv-create.component.html',
  styleUrls: ['./reserv-create.component.css']
})
export class ReservCreateComponent implements OnInit {

  @Input() reserv: Reserv;

  clients: Client[] = [];
  countries: Country[] = [];
  clientsCode: ViewClientReserv[] = [];
  clientId: number;
  code: string;

  private clientsSub: Subscription;
  private countriesSub: Subscription;
  modalRef: BsModalRef;
  mode = 'Crear';
  content = '';
  bsValue = new Date();
  bsRangeValue: Date[] = [];

  constructor(private modalService: BsModalService, private clientsreservsService: ClientsReservsService,
              private clientsService: ClientsService, private reservsService: ReservsService,
              private countriesService: CountriesService) {}

  ngOnInit() {
    this.clientsService.getClients();
    this.clientsSub = this.clientsService.getClientsUpdateListener()
    .subscribe((clients: Client[]) => {
    this.clients = clients;
    this.clientId = null;
    });
    this.countriesService.getCountries();
    this.countriesSub = this.countriesService.getCountriesUpdateListener()
    .subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    if (!isNull(this.reserv)) {
      this.mode = 'Editar';
      this.bsRangeValue = [new Date(this.reserv.checkIn), new Date(this.reserv.checkOut)];
    }
    if (this.mode === 'Crear') {
      this.content = 'Crear Reserva';
   }
  }

  getClient(clientId: number) {
    const client = this.clientsService.getClient(clientId.toString());
    return client.name + ' ' + client.lastName;
  }

  addClientInReserve() {
    if (this.clientId === null) {
      return;
    }
    const clients = this.clientsCode.filter(c => c.clientId.toString() === this.clientId.toString());
    if (this.mode === 'Editar') {
      const reservClients = this.reserv.clientsReserv.filter(c => c.clientId.toString() === this.clientId.toString());
      if (clients.length === 0 && reservClients.length === 0) {
        this.clientsCode.push({clientId: this.clientId, code: this.code});
      }
    } else {
      if (clients.length === 0) {
        this.clientsCode.push({clientId: this.clientId, code: this.code});
      }
    }
    this.clientId = null;
    this.code = null;
  }

  deleteClientInReserve(clientId: number, deleteCR: boolean) {
    if (deleteCR) {
      this.clientsreservsService.deleteClientReserv(clientId);
      this.reserv.clientsReserv = this.reserv.clientsReserv.filter(c => c.clientId.toString() !== clientId.toString());
    } else {
      this.clientsCode = this.clientsCode.filter(c => c.clientId.toString() !== clientId.toString());
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSaveReserv(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (isNull(this.reserv)) {
      const reserv: Reserv = {
        id: 0,
        checkIn: form.value.bsRangeValue[0],
        checkOut: form.value.bsRangeValue[1],
        reservationMethod: form.value.reservationMethod,
        fictionalPayment: form.value.fictionalPayment,
        realPayment: form.value.realPayment,
        rating: form.value.rating ? form.value.rating : 0,
        consume: form.value.consume,
        clientsReserv: null
      };
      this.reservsService.addReserv(reserv, this.clientsCode);
    } else {
      this.reserv.checkIn = form.value.bsRangeValue[0];
      this.reserv.checkOut = form.value.bsRangeValue[1];
      this.reserv.reservationMethod = form.value.reservationMethod;
      this.reserv.fictionalPayment = form.value.fictionalPayment;
      this.reserv.realPayment = form.value.realPayment;
      this.reserv.rating = (form.value.rating) ? form.value.rating : 0;
      this.reserv.consume = form.value.consume;
      this.reservsService.updateReserv(this.reserv, this.clientsCode);
    }
    if (this.mode === 'Crear') {
      form.onReset();
    }
    this.clientsCode = [];
    this.modalRef.hide();
  }

  classMode() {
    if (this.mode === 'Crear') {
      return 'btn btn-primary';
    } else {
      return 'btn btn-warning';
    }
  }

  close(form: NgForm) {
    if (this.mode === 'Crear') {
      form.onReset();
    }
    this.clientsCode = [];
    this.modalRef.hide();
  }

}
