import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IncomeService } from './income.service';

describe('IncomeService', () => {
  let service: IncomeService;
  let httpMock: HttpTestingController;
  const BASIC_URL = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncomeService]
    });
    service = TestBed.inject(IncomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post income', () => {
    const incomeDTO = { amount: 100 };
    service.postIncome(incomeDTO).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(incomeDTO);
    req.flush({});
  });

  it('should get all income', () => {
    service.getAllIncome().subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income/all');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get income by user id', () => {
    const userId = 1;
    service.getIncomeByUserId(userId).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income/user/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get income by id', () => {
    const id = 2;
    service.getIncomeById(id).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income/' + id);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should update income', () => {
    const id = 3;
    const incomeDTO = { amount: 200 };
    service.updateIncome(id, incomeDTO).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income/' + id);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(incomeDTO);
    req.flush({});
  });

  it('should delete income', () => {
    const id = 4;
    service.deleteIncome(id).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/income/' + id);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
