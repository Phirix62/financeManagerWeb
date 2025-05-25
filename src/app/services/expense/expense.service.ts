import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  postExpense(expenseDTO:any):Observable<any> {
    return this.http.post(BASIC_URL + 'api/expense', expenseDTO);
  }

  getAllExpense():Observable<any> {
    return this.http.get(BASIC_URL + 'api/expense/all');
  }
}
