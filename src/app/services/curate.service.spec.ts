import { TestBed, inject } from '@angular/core/testing';

import { CurateService } from './curate.service';

describe('CurateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurateService]
    });
  });

  it('should be created', inject([CurateService], (service: CurateService) => {
    expect(service).toBeTruthy();
  }));
});
