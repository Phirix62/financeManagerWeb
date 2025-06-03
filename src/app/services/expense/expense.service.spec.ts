import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpMock: HttpTestingController;
  const BASIC_URL = 'http://localhost:8080/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService]
    });
    service = TestBed.inject(ExpenseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post an expense', () => {
    const expenseDTO = { amount: 100, description: 'Test' };
    service.postExpense(expenseDTO).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expenseDTO);
    req.flush({});
  });

  it('should get all expenses', () => {
    service.getAllExpense().subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense/all');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get expenses by user id', () => {
    const userId = 1;
    service.getExpenseByUserId(userId).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense/user/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should delete an expense', () => {
    const id = 5;
    service.deleteExpense(id).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense/' + id);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get expense by id', () => {
    const id = 2;
    service.getExpenseById(id).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense/' + id);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should update an expense', () => {
    const id = 3;
    const expenseDTO = { amount: 200, description: 'Updated' };
    service.updateExpense(id, expenseDTO).subscribe();
    const req = httpMock.expectOne(BASIC_URL + 'api/expense/' + id);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expenseDTO);
    req.flush({});
  });
});
