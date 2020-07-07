/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientsReservsService } from './clients-reservs.service';

describe('Service: ClientsReservs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientsReservsService]
    });
  });

  it('should ...', inject([ClientsReservsService], (service: ClientsReservsService) => {
    expect(service).toBeTruthy();
  }));
});
