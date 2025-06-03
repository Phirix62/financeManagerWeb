import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

interface YearlyData {
  year: number;
  total: number;
  contribution: number;
  interest: number;
}

@Component({
  selector: 'app-investment-simulator',
  templateUrl: './investment-simulator.component.html',
  styleUrls: ['./investment-simulator.component.scss']
})
export class InvestmentSimulatorComponent {
  startingAmount = 5000;
  contribution = 100;
  rateOfReturn = 4; // %
  yearsToGrow = 10;

  finalAmount = 0;
  yearlyData: YearlyData[] = [];

  @ViewChild('investmentChart') investmentChart!: ElementRef<HTMLCanvasElement>;
  chart: any;

  calculateInvestment(): void {
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
    }

    this.finalAmount = +total.toFixed(2);
    this.updateChart(years, totalBalance, contributions, totalInterest);
  }

  updateChart(years: number[], totalBalance: number[], contributions: number[], totalInterest: number[]): void {
    if (this.chart) {
      this.chart.destroy();
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
  }
}
