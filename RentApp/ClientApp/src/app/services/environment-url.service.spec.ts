/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnvironmentUrlService } from './environment-url.service';

describe('Service: EnvironmentUrl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvironmentUrlService]
    });
  });

  it('should ...', inject([EnvironmentUrlService], (service: EnvironmentUrlService) => {
    expect(service).toBeTruthy();
  }));
});
