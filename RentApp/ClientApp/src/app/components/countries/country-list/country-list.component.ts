import { Component, OnInit, TemplateRef, Input, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Country } from 'src/app/models/country';
import { Subscription } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit, OnDestroy {

  country: Country;
  modalRef: BsModalRef;
  countries: Country[] = [];
  filtersCountries: Country[] = [];
  countriesPagination: Country[] = [];
  currentPage = 1;
  startItem = 0;
  endItem = 10;
  name: boolean = null;
  search: string = '';
  private countriesSub: Subscription;

  constructor(private modalService: BsModalService, private countriesService: CountriesService) {}

  ngOnInit() {
    this.countriesService.getCountries();
    this.countriesSub = this.countriesService.getCountriesUpdateListener()
      .subscribe((countries: Country[]) => {
        this.countries = countries;   
        this.filtersCountries = this.filters();
        this.orderByCountry();
        if ((this.currentPage - 1) * 10 === this.countries.length) {
          this.currentPage = Math.max(this.currentPage - 1, 1);
        }
        this.startItem = (this.currentPage - 1) * 10;
        this.endItem = this.currentPage * 10;
        this.countriesPagination = this.filtersCountries.slice(this.startItem, this.endItem);
      });
  }

  ngOnDestroy() {
    this.countriesSub.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  pageChanged(event: PageChangedEvent): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.countriesPagination = this.filtersCountries.slice(this.startItem, this.endItem);
  }

  deleteCountry(id: number) {
    this.countriesService.deleteCountry(id);
  }

  filters() {
    return this.countries.filter(c => c.name.toLowerCase().startsWith(this.search.toLowerCase()));
  }

  filterChange() {
    this.startItem = 0;
    this.currentPage = 1;
    this.endItem = 10;   
    this.filtersCountries = this.filters();
    this.orderByCountry();
    this.countriesPagination = this.filtersCountries.slice(this.startItem, this.endItem);
  }

  orderBy() {
    if (this.name === null) {
      this.name = true;
    } else {
      this.name = !this.name;
    }
    this.orderByCountry();
    this.countriesPagination = this.filtersCountries.slice(this.startItem, this.endItem);
  }

  orderByCountry() {
    if (this.name) {
      this.filtersCountries.sort(this.sortCountry);
    } else {
      this.filtersCountries.sort((a: Country, b: Country) => -1*this.sortCountry(a,b));
    } 
  }

  private sortCountry(a: Country, b: Country) {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  }

  printArrow(): string {
    return this.name ? 'assets/up-arrow.png' : 'assets/down-arrow.png'
  }

}
