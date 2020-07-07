import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Country } from 'src/app/models/country';
import { CountriesService } from 'src/app/services/countries.service';
import { isNull } from 'util';

@Component({
  selector: 'app-country-create',
  templateUrl: './country-create.component.html',
  styleUrls: ['./country-create.component.css']
})
export class CountryCreateComponent implements OnInit {

  @Input() country: Country;
  modalRef: BsModalRef;
  mode = 'Crear';
  content = '';

  constructor(private modalService: BsModalService, private countriesService: CountriesService) {}

  ngOnInit() {
    if (!isNull(this.country)) {
      this.mode = 'Editar';
    }
    if (this.mode === 'Crear') {
      this.content = 'Crear Cliente';
   }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSaveCountry(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (isNull(this.country)) {
      const country: Country = {
        id: 0,
        name: form.value.name
      };
      this.countriesService.addCountry(country);
    } else {
      this.country.name = form.value.name;
      this.countriesService.updateCountry(this.country);
    }
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

  close(form: NgForm) {
    
    this.modalRef.hide();
    form.onReset();
  }

}
