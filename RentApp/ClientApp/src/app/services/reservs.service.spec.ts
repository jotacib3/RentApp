/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReservsService } from './reservs.service';

describe('Service: Reservs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReservsService]
    });
  });

  it('should ...', inject([ReservsService], (service: ReservsService) => {
    expect(service).toBeTruthy();
  }));
});
