import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const BASIC_URL = 'http://localhost:8080/';

/**
 * Service for retrieving statistics and chart data for a user.
 */
@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  /**
   * Retrieves statistics for a given user.
   * @param userId The ID of the user whose stats are to be fetched.
   * @returns An Observable containing the user's statistics.
   */
  getStats(userId: number): Observable<any> {
    console.log(`[StatsService] Fetching stats for userId: ${userId}`);
    return this.http.get(BASIC_URL + 'api/stats/' + userId).pipe(
      tap({
        next: data => console.log('[StatsService] Stats fetched:', data),
        error: err => console.error('[StatsService] Error fetching stats:', err)
      })
    );
  }

  /**
   * Retrieves chart data for a given user.
   * @param userId The ID of the user whose chart data is to be fetched.
   * @returns An Observable containing the user's chart data.
   */
  getChart(userId: number): Observable<any> {
    console.log(`[StatsService] Fetching chart data for userId: ${userId}`);
    return this.http.get(BASIC_URL + 'api/stats/' + userId + '/chart').pipe(
      tap({
        next: data => console.log('[StatsService] Chart data fetched:', data),
        error: err => console.error('[StatsService] Error fetching chart data:', err)
      })
    );
  }
}
