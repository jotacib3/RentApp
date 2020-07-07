import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Client } from 'src/app/models/client';
import { ClientsService } from 'src/app/services/clients.service';
import { isNull } from 'util';
import { NgForm } from '@angular/forms';
import { Country } from 'src/app/models/country';
import { Subscription } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent implements OnInit {

  @Input() client: Client;
  @Input() countries: Country[];
  modalRef: BsModalRef;
  mode = 'Crear';
  content = '';

  constructor(private modalService: BsModalService, private clientsService: ClientsService, private countriesService: CountriesService) {}

  ngOnInit() {
    if (!isNull(this.client)) {
      this.mode = 'Editar';
    }
    if (this.mode === 'Crear') {
       this.content = 'Crear Cliente';
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSaveClient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const id: number = form.value.countryId;
    const country = this.getCountry(id.toString());
    if (isNull(this.client)) {
      const client: Client = {
        id: 0,
        name: form.value.name,
        lastName: form.value.lastName,
        countryId: form.value.countryId,
        ci: form.value.ci,
        country: null
      };
      this.clientsService.addClient(client, country);
    } else {
      this.client.name = form.value.name;
      this.client.lastName = form.value.lastName;
      this.client.countryId = form.value.countryId ;
      this.client.ci = form.value.ci;
      this.client.country = null;
      this.clientsService.updateClient(this.client, country);
    }
    this.modalRef.hide();
    form.onReset();
  }

  close(form: NgForm) {
    this.modalRef.hide();
    form.onReset();
  }

  classMode() {
    if (this.mode === 'Crear') {
      return 'btn btn-primary';
    } else {
      return 'btn btn-warning';
    }
  }

  getCountry(id: string) {
    return {...this.countries.find(r => r.id.toString() === id)};
  }

}
