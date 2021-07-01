import { TestBed } from '@angular/core/testing';

import { ListTechs.ApiService } from './list-techs.api.service';

describe('ListTechs.ApiService', () => {
  let service: ListTechs.ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListTechs.ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
