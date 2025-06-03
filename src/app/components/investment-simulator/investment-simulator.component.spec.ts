import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentSimulatorComponent } from './investment-simulator.component';
import { ElementRef } from '@angular/core';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { FormsModule } from '@angular/forms';

describe('InvestmentSimulatorComponent', () => {
  let component: InvestmentSimulatorComponent;
  let fixture: ComponentFixture<InvestmentSimulatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, FormsModule],
      declarations: [InvestmentSimulatorComponent]
    });
    fixture = TestBed.createComponent(InvestmentSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.startingAmount).toBe(5000);
    expect(component.contribution).toBe(100);
    expect(component.rateOfReturn).toBe(4);
    expect(component.yearsToGrow).toBe(10);
    expect(component.finalAmount).toBe(0);
    expect(component.yearlyData).toEqual([]);
  });

  it('should calculate investment and populate yearlyData and finalAmount', () => {
    // Mock chart and ElementRef to avoid Chart.js errors
    component.investmentChart = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;
    spyOn(component, 'updateChart');

    component.startingAmount = 1000;
    component.contribution = 200;
    component.rateOfReturn = 5;
    component.yearsToGrow = 3;

    component.calculateInvestment();

    expect(component.yearlyData.length).toBe(3);
    expect(component.finalAmount).toBeGreaterThan(0);
    expect(component.updateChart).toHaveBeenCalled();
    // Check that yearlyData contains correct years
    const currentYear = new Date().getFullYear();
    expect(component.yearlyData[0].year).toBe(currentYear + 1);
    expect(component.yearlyData[2].year).toBe(currentYear + 3);
  });

  it('should destroy previous chart instance in updateChart', () => {
    // Mock chart and ElementRef
    component.investmentChart = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;
    const destroySpy = jasmine.createSpy('destroy');
    component.chart = { destroy: destroySpy };

    component.updateChart([2024], [100], [100], [0]);
    expect(destroySpy).toHaveBeenCalled();
    expect(component.chart).toBeDefined();
  });

  it('should create a new chart in updateChart', () => {
    component.investmentChart = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;
    component.chart = undefined;

    component.updateChart([2024, 2025], [100, 200], [100, 200], [0, 10]);
    expect(component.chart).toBeDefined();
    expect(component.chart.config.type).toBe('bar');
    expect(component.chart.config.data.labels).toEqual(['2024', '2025']);
  });

  it('should handle zero yearsToGrow gracefully', () => {
    component.investmentChart = {
      nativeElement: document.createElement('canvas')
    } as ElementRef<HTMLCanvasElement>;
    spyOn(component, 'updateChart');
    component.yearsToGrow = 0;
    component.calculateInvestment();
    expect(component.yearlyData.length).toBe(0);
    expect(component.finalAmount).toBe(component.startingAmount);
    expect(component.updateChart).toHaveBeenCalledWith([], [], [], []);
  });
});
