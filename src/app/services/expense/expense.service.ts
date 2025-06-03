import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

/**
 * Service for managing expense-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  /**
   * Creates a new expense.
   * @param expenseDTO The expense data transfer object.
   * @returns Observable of the created expense.
   */
  postExpense(expenseDTO: any): Observable<any> {
    console.log('Posting new expense:', expenseDTO);
    return this.http.post(BASIC_URL + 'api/expense', expenseDTO);
  }

  /**
   * Retrieves all expenses.
   * @returns Observable of all expenses.
   */
  getAllExpense(): Observable<any> {
    console.log('Fetching all expenses');
    return this.http.get(BASIC_URL + 'api/expense/all');
  }

  /**
   * Retrieves expenses by user ID.
   * @param userId The user's ID.
   * @returns Observable of expenses for the given user.
   */
  getExpenseByUserId(userId: number): Observable<any> {
    console.log(`Fetching expenses for userId: ${userId}`);
    return this.http.get(BASIC_URL + 'api/expense/user/' + userId);
  }

  /**
   * Deletes an expense by ID.
   * @param id The expense ID.
   * @returns Observable of the delete operation result.
   */
  deleteExpense(id: number): Observable<any> {
    console.log(`Deleting expense with id: ${id}`);
    return this.http.delete(BASIC_URL + 'api/expense/' + id);
  }

  /**
   * Retrieves an expense by ID.
   * @param id The expense ID.
   * @returns Observable of the expense.
   */
  getExpenseById(id: number): Observable<any> {
    console.log(`Fetching expense with id: ${id}`);
    return this.http.get(BASIC_URL + 'api/expense/' + id);
  }

  /**
   * Updates an existing expense.
   * @param id The expense ID.
   * @param expenseDTO The updated expense data.
   * @returns Observable of the updated expense.
   */
  updateExpense(id: number, expenseDTO: any): Observable<any> {
    console.log(`Updating expense with id: ${id}`, expenseDTO);
    return this.http.put(BASIC_URL + 'api/expense/' + id, expenseDTO);
  }
}
