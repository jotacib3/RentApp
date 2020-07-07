import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ReservListComponent } from './components/reservs/reserv-list/reserv-list.component';
import { ClientReservListComponent } from './components/clients-reservs/client-reserv-list/client-reserv-list.component';
import { CountryListComponent } from './components/countries/country-list/country-list.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'countries', component: CountryListComponent},
  {path: 'clients', component: ClientListComponent},
  {path: 'reservs', component: ReservListComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'clients-reservs', component: ClientReservListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
