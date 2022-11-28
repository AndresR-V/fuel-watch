import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrudService } from './crud.service';
import { HttpClientModule } from '@angular/common/http';

describe('CrudService', () => {
  let service: CrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientTestingModule],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
