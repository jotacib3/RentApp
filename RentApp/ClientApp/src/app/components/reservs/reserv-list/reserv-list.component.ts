import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Reserv } from 'src/app/models/reserv';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ReservsService } from 'src/app/services/reservs.service';

@Component({
  selector: 'app-reserv-list',
  templateUrl: './reserv-list.component.html',
  styleUrls: ['./reserv-list.component.css']
})
export class ReservListComponent implements OnInit, OnDestroy {

  reserv: Reserv;
  modalRef: BsModalRef;
  reservs: Reserv[] = [];
  filtersReservs: Reserv[] = [];
  reservsPagination: Reserv[] = [];
  startItem = 0;
  currentPage = 1;
  endItem = 10;
  private reservsSub: Subscription;
  max = 5;
  searchReservationMetod: string = '';
  searchId: string = '';
  bsRangeValue: Date[];
  searchRealPayment: string = '';
  searchFictionalPayment: string = '';
  searchRating: string = '';
  searchConsume: string = '';
  isReadonly = true;
  bsValue = new Date();
  searchBsRangeValue: Date[]= [null, null];
  maxDate = new Date();
  private properties: string[] = [];
  filter: Map<string,boolean> = new Map<string,boolean>();
  op: Map<[string, boolean], (a: Reserv, b: Reserv) => number> = new Map<[string, boolean], (a: Reserv, b: Reserv) => number>();

  constructor(private modalService: BsModalService, private reservsService: ReservsService) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 2);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.filter.set('id', true);
    this.filter.set('checkIn', null);
    this.filter.set('checkOut', null);
    this.filter.set('realPayment', null);
    this.filter.set('fictionalPayment', null);
    this.filter.set('reservationMetod', null);
    this.filter.set('rating', null);
    this.op.set(['id', true], this.sortReservId);
    this.op.set(['id', false], (a: Reserv, b: Reserv) => -1*this.sortReservId(a,b))
    this.op.set(['checkIn', true], this.sortCheckIn);
    this.op.set(['checkIn', false], (a: Reserv, b: Reserv) => -1*this.sortCheckIn(a,b))
    this.op.set(['checkOut', true], this.sortCheckOut);
    this.op.set(['checkOut', false], (a: Reserv, b: Reserv) => -1*this.sortCheckOut(a,b))
    this.op.set(['realPayment', true], this.sortRealPayment);
    this.op.set(['realPayment', false], (a: Reserv, b: Reserv) => -1*this.sortRealPayment(a,b));
    this.op.set(['fictionalPayment', true], this.sortRealPayment);
    this.op.set(['fictionalPayment', false], (a: Reserv, b: Reserv) => -1*this.sortFicitionalPayment(a,b))
    this.op.set(['reservationMetod', true], this.sortReservationMetod);
    this.op.set(['reservationMetod', false], (a: Reserv, b: Reserv) => -1*this.sortReservationMetod(a,b));
    this.op.set(['rating', true], this.sortRating);
    this.op.set(['rating', false], (a: Reserv, b: Reserv) => -1*this.sortRating(a,b));
  }

  ngOnInit() {
    this.reservsService.getReservs();
    this.reservsSub = this.reservsService.getReservsUpdateListener()
      .subscribe((reservs: Reserv[]) => {
        this.reservs = reservs;
        this.filtersReservs = this.filters();
        this.orderByReserv();
        if ((this.currentPage - 1) * 10 === this.reservs.length) {
          this.currentPage = Math.max(this.currentPage - 1, 1);
        }
        this.startItem = (this.currentPage - 1) * 10;
        this.endItem = this.currentPage * 10;
        this.reservsPagination = this.filtersReservs.slice(this.startItem, this.endItem);
      });
  }

  ngOnDestroy() {
    this.reservsSub.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  pageChanged(event: PageChangedEvent): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.reservsPagination = this.filtersReservs.slice(this.startItem, this.endItem);
  }

  deleteReserv(id: number, i: number) {
    this.reservsService.deleteReserv(id);
  }

  filters() {
    let temp = this.reservs;

    if (this.searchBsRangeValue !== null && this.searchBsRangeValue[0] !== null) {
      temp = temp.filter(c => new Date(c.checkIn) > this.searchBsRangeValue[0] && new Date(c.checkOut) < this.searchBsRangeValue[1]);
    }

    if (this.searchReservationMetod !== '')
      temp = temp.filter(c => c.reservationMethod.toLowerCase().startsWith(this.searchReservationMetod.toLowerCase()));

    if (this.searchConsume != '') {
      temp = temp.filter(c => c.consume.toString().toLowerCase().startsWith(this.searchConsume.toLowerCase()));
    }

    if (this.searchId != '') {
      temp = temp.filter(c => c.id.toString().toLowerCase().startsWith(this.searchId.toLowerCase()));
    }

    if (this.searchRating!= '') {
      temp = temp.filter(c => c.rating.toString().toLowerCase().startsWith(this.searchRating.toLowerCase()));
    }

    if (this.searchRealPayment != '') {
      temp = temp.filter(c => c.realPayment.toString().toLowerCase().startsWith(this.searchRealPayment.toLowerCase()));
    }

    if (this.searchFictionalPayment != '') {
      temp = temp.filter(c => c.fictionalPayment.toString().toLowerCase().startsWith(this.searchFictionalPayment.toLowerCase()));
    }

    return temp;
                                            
  }

  filterChange() {
    this.startItem = 0;
    this.currentPage = 1;
    this.endItem = 10;
    this.filtersReservs = this.filters();
    this.orderByReserv();
    this.reservsPagination = this.filtersReservs.slice(this.startItem, this.endItem);
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
    this.orderByReserv();
    this.reservsPagination = this.filtersReservs.slice(this.startItem, this.endItem); 
  }

  printArrow(property: string): string {
    return this.filter.get(property) ? 'assets/up-arrow.png' : 'assets/down-arrow.png'
  }

  orderByReserv() {
    const propertiesLength = this.properties.length;
    for (let i = 0; i < propertiesLength; i++) {
      for (const [key, value] of this.op) {
        if (key[0] === this.properties[i]) {
          const cmp = this.filter.get(key[0])
          if ( cmp !== null && cmp === key[1]) {
            this.filtersReservs = this.filtersReservs.sort(this.op.get(key));
          }
        }        
      }
    }
  }

  sortReservId(a: Reserv, b: Reserv) {
    return a.id - b.id;
  }

  sortRealPayment(a: Reserv, b: Reserv) {
    return a.realPayment - b.realPayment;
  }

  sortFicitionalPayment(a: Reserv, b: Reserv) {
    return a.fictionalPayment - b.fictionalPayment;
  }

  sortRating(a: Reserv, b: Reserv) {
    return a.rating - b.rating;
  }

  sortCheckIn(a: Reserv, b: Reserv) {
    return new Date(a.checkIn) > new Date(b.checkIn) ? 1 : -1;
  }

  sortCheckOut(a: Reserv, b: Reserv) {
    return new Date(a.checkOut) > new Date(b.checkOut) ? 1 : -1;
  }

  sortReservationMetod(a: Reserv, b: Reserv) {
    return a.reservationMethod.toLowerCase() > b.reservationMethod.toLowerCase() ? 1 : -1;
  }

}
