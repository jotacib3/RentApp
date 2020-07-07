import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ClientReserv } from 'src/app/models/client-reserv';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ClientsReservsService } from 'src/app/services/clients-reservs.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-client-reserv-list',
  templateUrl: './client-reserv-list.component.html',
  styleUrls: ['./client-reserv-list.component.css']
})
export class ClientReservListComponent implements OnInit, OnDestroy {

  clientreserv: ClientReserv;
  modalRef: BsModalRef;
  clientsreservs: ClientReserv[] = [];
  clientreservsPagination: ClientReserv[] = [];
  startItem = 0;
  endItem = 10;
  currentPage = 1;
  private clientreservsSub: Subscription;
  max = 5;
  isReadonly = true;

  constructor(private modalService: BsModalService, private clientreservsService: ClientsReservsService) { }

  ngOnInit() {
    this.clientreservsService.getClientReservs();
    this.clientreservsSub = this.clientreservsService.getClientReservsUpdateListener()
      .subscribe((clientreservs: ClientReserv[]) => {
        this.clientsreservs = clientreservs;
        if ((this.currentPage - 1) * 10 === this.clientsreservs.length) {
          this.currentPage = Math.max(this.currentPage - 1, 0);
        }
        this.startItem = (this.currentPage - 1) * 10;
        this.endItem = this.currentPage * 10;
        this.clientreservsPagination = this.clientsreservs.slice(this.startItem, this.endItem);
      });
  }

  ngOnDestroy() {
    this.clientreservsSub.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  pageChanged(event: PageChangedEvent): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.clientreservsPagination = this.clientsreservs.slice(this.startItem, this.endItem);
  }

  deleteClientReserv(id: number) {
    this.clientreservsService.deleteClientReserv(id);
  }


}
