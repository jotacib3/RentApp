import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Client} from 'src/app/models/client';
import { ClientReserv } from 'src/app/models/client-reserv';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ClientsReservsService } from 'src/app/services/clients-reservs.service';
import { ClientsService } from 'src/app/services/clients.service';
import { ReservsService } from 'src/app/services/reservs.service';
import { isNull } from 'util';
import { NgForm } from '@angular/forms';
import { Reserv } from 'src/app/models/reserv';

@Component({
  selector: 'app-client-reserv-create',
  templateUrl: './client-reserv-create.component.html',
  styleUrls: ['./client-reserv-create.component.css']
})
export class ClientReservCreateComponent implements OnInit {

  @Input() clientreserv: ClientReserv;
  clients: Client[] = [];
  reservs: Reserv[] = [];
  modalRef: BsModalRef;
  mode = 'Create';
  private clientsSub: Subscription;
  private reservsSub: Subscription;

  constructor(private modalService: BsModalService, private clientsreservsService: ClientsReservsService,
              private clientsService: ClientsService, private reservsService: ReservsService) {}

  ngOnInit() {
    this.clientsService.getClients();
    this.clientsSub = this.clientsService.getClientsUpdateListener()
      .subscribe((clients: Client[]) => {
        this.clients = clients  ;
      });
    this.reservsService.getReservs();
    this.reservsSub = this.reservsService.getReservsUpdateListener()
      .subscribe((reservs: Reserv[]) => {
        this.reservs = reservs  ;
      });
    if (!isNull(this.clientreserv)) {
      this.mode = 'Edit';
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSaveClientReserv(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const clientId: number = form.value.clientId;
    const reservId: number = form.value.reservId;
    const client = this.clientsService.getClient(clientId.toString());
    const reserv = this.reservsService.getReserv(reservId.toString());
    if (isNull(this.clientreserv)) {
      const clientreserv: ClientReserv = {
        id: 0,
        code: form.value.code,
        clientId: form.value.clientId,
        reservId: form.value.reservId,
        client: null,
        reserv: null
      };
      this.clientsreservsService.addClientReserv(clientreserv, client, reserv);
    } else {
      this.clientreserv.code = form.value.code;
      this.clientreserv.clientId = form.value.clientId;
      this.clientreserv.reservId = form.value.reservId;
      this.clientreserv.client = null;
      this.clientreserv.reserv = null;
      this.clientsreservsService.updateClientReserv(this.clientreserv, client, reserv);
    }
    this.modalRef.hide();
    form.onReset();
  }

  classMode() {
    if (this.mode === 'Create') {
      return 'btn btn-primary';
    } else {
      return 'btn btn-warning';
    }
  }

}
