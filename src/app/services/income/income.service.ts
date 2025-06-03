import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

/**
 * Service for managing income-related API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) { }

  /**
   * Posts a new income entry to the backend.
   * @param incomeDTO The income data transfer object.
   * @returns Observable of the created income.
   */
  postIncome(incomeDTO: any): Observable<any> {
    console.log('Posting new income:', incomeDTO);
    return this.http.post(BASIC_URL + "api/income", incomeDTO);
  }

  /**
   * Retrieves all income entries from the backend.
   * @returns Observable of all incomes.
   */
  getAllIncome(): Observable<any> {
    console.log('Fetching all incomes');
    return this.http.get(BASIC_URL + "api/income/all");
  }

  /**
   * Retrieves income entries for a specific user.
   * @param userId The user's ID.
   * @returns Observable of the user's incomes.
   */
  getIncomeByUserId(userId: number): Observable<any> {
    console.log('Fetching incomes for userId:', userId);
    return this.http.get(BASIC_URL + "api/income/user/" + userId);
  }

  /**
   * Retrieves a specific income entry by its ID.
   * @param id The income ID.
   * @returns Observable of the income.
   */
  getIncomeById(id: number): Observable<any> {
    console.log('Fetching income by id:', id);
    return this.http.get(BASIC_URL + "api/income/" + id);
  }

  /**
   * Updates an existing income entry.
   * @param id The income ID.
   * @param incomeDTO The updated income data.
   * @returns Observable of the updated income.
   */
  updateIncome(id: number, incomeDTO: any): Observable<any> {
    console.log('Updating income id:', id, 'with data:', incomeDTO);
    return this.http.put(BASIC_URL + "api/income/" + id, incomeDTO);
  }

  /**
   * Deletes an income entry by its ID.
   * @param id The income ID.
   * @returns Observable of the deletion result.
   */
  deleteIncome(id: number): Observable<any> {
    console.log('Deleting income id:', id);
    return this.http.delete(BASIC_URL + "api/income/" + id);
  }
}
