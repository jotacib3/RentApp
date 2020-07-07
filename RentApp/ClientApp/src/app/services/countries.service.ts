import { Injectable } from '@angular/core';
import { Country } from '../models/country';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private countries: Country[] = [];
  private countriesUpdated = new Subject<Country[]>();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getExample() {
    this.http.get<Country[]>(`https://restcountries.eu/rest/v2/all`)
    .subscribe((countriesData) => {
      console.log(countriesData);
    }, error => console.error(error));
  }
  getCountries() {
    this.http.get<Country[]>(`${this.envUrl.urlAddress}/countries`)
    .subscribe((countriesData) => {
      this.countries = countriesData;
      this.countriesUpdated.next([...this.countries]);
    }, error => console.error(error));
  }

  getCountriesUpdateListener() {
    return this.countriesUpdated.asObservable();
  }
  getCountry(id: string) {
    return {...this.countries.find(r => r.id.toString() === id)};
  }
  addCountry(country: Country) {
    this.http.post<Country>(`${this.envUrl.urlAddress}/countries`, country, this.generateHeaders())
    .subscribe(countryData => {
      const id = countryData.id;
      country.id = id;
      this.countries.push(country);
      this.countriesUpdated.next([...this.countries]);
    }, error => console.error(error));
  }

  updateCountry(country: Country) {
    this.http.put(`${this.envUrl.urlAddress}/countries/${country.id}`, country, this.generateHeaders())
    .subscribe( response => {
      const updatedCountries = {...this.countries};
      const oldCountryIndex = updatedCountries.findIndex(c => c.id === country.id);
      updatedCountries[oldCountryIndex] = country;
      this.countries = updatedCountries;
      this.countriesUpdated.next([...this.countries]);
    }, error => console.error(error));
  }

  deleteCountry(countryId: number) {
    this.http.delete(`${this.envUrl.urlAddress}/countries/${countryId}`)
    .subscribe( response => {
    const updatedCountries = this.countries.filter(c => c.id !== countryId);
    this.countries = updatedCountries;
    this.countriesUpdated.next([...this.countries]);
    }, error => console.error(error));
  }

  private generateHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
}
