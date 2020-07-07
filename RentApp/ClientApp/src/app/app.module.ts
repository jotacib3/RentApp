import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ReservListComponent } from './components/reservs/reserv-list/reserv-list.component';
import { ClientReservListComponent } from './components/clients-reservs/client-reserv-list/client-reserv-list.component';
import { CountryListComponent } from './components/countries/country-list/country-list.component';
import { CountryCreateComponent } from './components/countries/country-create/country-create.component';
import { ClientCreateComponent } from './components/clients/client-create/client-create.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReservCreateComponent } from './components/reservs/reserv-create/reserv-create.component';
import { ClientReservCreateComponent } from './components/clients-reservs/client-reserv-create/client-reserv-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    ClientListComponent,
    ReservListComponent,
    ReservCreateComponent,
    ClientReservListComponent,
    CountryListComponent,
    CountryCreateComponent,
    ClientCreateComponent,
    ReportsComponent,
    ClientReservCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    RatingModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
