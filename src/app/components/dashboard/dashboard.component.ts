import { Component, ElementRef, ViewChild } from '@angular/core';
import { StatsService } from 'src/app/services/stats/stats.service';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth/auth.service';

Chart.register(CategoryScale);

/**
 * DashboardComponent displays user financial statistics and charts.
 * It fetches stats and chart data from backend services and renders line charts for incomes and expenses.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  /** User statistics object */
  stats: any;
  /** List of expense objects */
  expenses: any;
  /** List of income objects */
  incomes: any;

  /** Style for grid elements */
  gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  /** Reference to the income chart canvas element */
  @ViewChild('incomeLineChartRef') public incomeLineChartRef: ElementRef;
  /** Reference to the expense chart canvas element */
  @ViewChild('expenseLineChartRef') public expenseLineChartRef: ElementRef;

  /**
   * Constructor injects StatsService and AuthService.
   * @param statsService Service for fetching statistics
   * @param authService Service for authentication and user info
   */
  constructor(private statsService: StatsService, private authService: AuthService) {}

  /**
   * Angular lifecycle hook. Fetches stats and chart data on component initialization.
   */
  ngOnInit() {
    console.log('[DashboardComponent] Initializing dashboard...');
    this.getStats();
    this.getChartData();
  }

  /**
   * Creates line charts for incomes and expenses using Chart.js.
   */
  createLineChart() {
    console.log('[DashboardComponent] Creating line charts...');
    const incomeCtx = this.incomeLineChartRef.nativeElement.getContext('2d');
    const expenseCtx = this.expenseLineChartRef.nativeElement.getContext('2d');

    new Chart(incomeCtx, {
      type: 'line',
      data: {
        labels: this.incomes.map(income => income.date),
        datasets: [{
          label: 'Income',
          data: this.incomes.map(income => income.amount),
          borderWidth: 1,
          backgroundColor: 'rgb(80, 200, 120)',
          borderColor: 'rgb(0, 100, 0)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(expenseCtx, {
      type: 'line',
      data: {
        labels: this.expenses.map(expense => expense.date),
        datasets: [{
          label: 'Expense',
          data: this.expenses.map(expense => expense.amount),
          borderWidth: 1,
          backgroundColor: 'rgb(255, 0, 0)',
          borderColor: 'rgb(200, 0, 0)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    console.log('[DashboardComponent] Line charts created.');
  }

  /**
   * Fetches user statistics from the backend and assigns them to the stats property.
   */
  getStats() {
    const userId = this.authService.getCurrentUser().id;
    console.log(`[DashboardComponent] Fetching stats for userId: ${userId}`);
    this.statsService.getStats(userId).subscribe(
      (res) => {
        console.log('[DashboardComponent] Stats fetched:', res);
        this.stats = res;
      },
      (error) => {
        console.error('[DashboardComponent] Error fetching stats:', error);
      }
    );
  }

  /**
   * Fetches chart data (incomes and expenses) from the backend and creates charts.
   */
  getChartData() {
    const userId = this.authService.getCurrentUser().id;
    console.log(`[DashboardComponent] Fetching chart data for userId: ${userId}`);
    this.statsService.getChart(userId).subscribe(
      (res) => {
        if (res.expenseList != null && res.incomeList != null) {
          this.incomes = res.incomeList;
          this.expenses = res.expenseList;
          console.log('[DashboardComponent] Chart data fetched:', res);
          this.createLineChart();
        } else {
          console.warn('[DashboardComponent] Chart data is incomplete:', res);
        }
      },
      (error) => {
        console.error('[DashboardComponent] Error fetching chart data:', error);
      }
    );
  }

}
