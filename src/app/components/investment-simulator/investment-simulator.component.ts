import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

interface YearlyData {
  year: number;
  total: number;
  contribution: number;
  interest: number;
}

/**
 * InvestmentSimulatorComponent
 * 
 * This component allows users to simulate investment growth over time,
 * given a starting amount, annual contribution, rate of return, and investment duration.
 * It calculates yearly balances, contributions, and interest, and displays the results in a chart.
 */
@Component({
  selector: 'app-investment-simulator',
  templateUrl: './investment-simulator.component.html',
  styleUrls: ['./investment-simulator.component.scss']
})
export class InvestmentSimulatorComponent {
  /** Initial investment amount */
  startingAmount = 5000;
  /** Annual contribution */
  contribution = 100;
  /** Expected annual rate of return (percentage) */
  rateOfReturn = 4; // %
  /** Number of years to grow the investment */
  yearsToGrow = 10;

  /** Final calculated investment amount */
  finalAmount = 0;
  /** Array holding yearly investment data */
  yearlyData: YearlyData[] = [];

  /** Reference to the chart canvas element */
  @ViewChild('investmentChart') investmentChart!: ElementRef<HTMLCanvasElement>;
  /** Chart.js chart instance */
  chart: any;

  /**
   * Calculates the investment growth over the specified period.
   * Updates the yearlyData array and the chart.
   */
  calculateInvestment(): void {
    console.log('Starting investment calculation...');
    const rate = this.rateOfReturn / 100;
    let total = this.startingAmount;
    this.yearlyData = [];

    const totalBalance: number[] = [];
    const contributions: number[] = [];
    const totalInterest: number[] = [];
    const years: number[] = [];

    for (let year = 1; year <= this.yearsToGrow; year++) {
      total += this.contribution;
      total *= (1 + rate);
      const interest = total - (this.startingAmount + this.contribution * year);

      const yearData: YearlyData = {
        year: new Date().getFullYear() + year,
        total: +total.toFixed(2),
        contribution: this.startingAmount + this.contribution * year,
        interest: +interest.toFixed(2)
      };
      this.yearlyData.push(yearData);

      years.push(yearData.year);
      totalBalance.push(yearData.total);
      contributions.push(yearData.contribution);
      totalInterest.push(yearData.interest);

      console.log(`Year ${yearData.year}: Total=${yearData.total}, Contribution=${yearData.contribution}, Interest=${yearData.interest}`);
    }

    this.finalAmount = +total.toFixed(2);
    console.log('Final amount:', this.finalAmount);
    this.updateChart(years, totalBalance, contributions, totalInterest);
  }

  /**
   * Updates the investment chart with new data.
   * @param years Array of years
   * @param totalBalance Array of total balances per year
   * @param contributions Array of contributions per year
   * @param totalInterest Array of total interest per year
   */
  updateChart(years: number[], totalBalance: number[], contributions: number[], totalInterest: number[]): void {
    if (this.chart) {
      this.chart.destroy();
      console.log('Destroyed previous chart instance.');
    }

    this.chart = new Chart(this.investmentChart.nativeElement, {
      type: 'bar',
      data: {
        labels: years.map(y => y.toString()),
        datasets: [
          { label: 'Total Balance', data: totalBalance, backgroundColor: '#1890ff' },
          { label: 'Contributions', data: contributions, backgroundColor: '#52c41a' },
          { label: 'Total Interest', data: totalInterest, backgroundColor: '#faad14' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    console.log('Chart updated with new data.');
  }
}
