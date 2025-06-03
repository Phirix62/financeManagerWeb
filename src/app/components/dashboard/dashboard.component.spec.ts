import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { StatsService } from 'src/app/services/stats/stats.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import Chart from 'chart.js/auto';

// Attach Chart constructor to window for spying before importing the component
(window as any).Chart = Chart;

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let statsServiceSpy: jasmine.SpyObj<StatsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    statsServiceSpy = jasmine.createSpyObj('StatsService', ['getStats', 'getChart']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule],
      declarations: [DashboardComponent],
      providers: [
        { provide: StatsService, useValue: statsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getStats and getChartData on ngOnInit', () => {
    spyOn(component, 'getStats');
    spyOn(component, 'getChartData');
    component.ngOnInit();
    expect(component.getStats).toHaveBeenCalled();
    expect(component.getChartData).toHaveBeenCalled();
  });

  it('should set stats on successful getStats', () => {
    const mockStats = { total: 100 };
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });
    statsServiceSpy.getStats.and.returnValue(of(mockStats));
    component.getStats();
    expect(component.stats).toEqual(mockStats);
  });

  it('should handle error on getStats', () => {
    spyOn(console, 'error');
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });
    statsServiceSpy.getStats.and.returnValue(throwError(() => new Error('fail')));
    component.getStats();
    expect(console.error).toHaveBeenCalledWith('Error fetching stats:', jasmine.any(Error));
  });

  it('should set incomes and expenses and call createLineChart on successful getChartData', () => {
    const mockChart = {
      incomeList: [{ date: '2024-01-01', amount: 100 }],
      expenseList: [{ date: '2024-01-01', amount: 50 }]
    };
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });
    statsServiceSpy.getChart.and.returnValue(of(mockChart));
    spyOn(component, 'createLineChart');
    component.getChartData();
    expect(component.incomes).toEqual(mockChart.incomeList);
    expect(component.expenses).toEqual(mockChart.expenseList);
    expect(component.createLineChart).toHaveBeenCalled();
  });

  it('should handle error on getChartData', () => {
    spyOn(console, 'error');
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });
    statsServiceSpy.getChart.and.returnValue(throwError(() => new Error('fail')));
    component.getChartData();
    expect(console.error).toHaveBeenCalledWith('Error fetching chart data:', jasmine.any(Error));
  });

  it('should not call createLineChart if incomeList or expenseList is null', () => {
    const mockChart = { incomeList: null, expenseList: null };
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });
    statsServiceSpy.getChart.and.returnValue(of(mockChart));
    spyOn(component, 'createLineChart');
    component.getChartData();
    expect(component.createLineChart).not.toHaveBeenCalled();
  });

  it('should call Chart constructor in createLineChart', () => {
    // Mock incomes and expenses
    component.incomes = [{ date: '2024-01-01', amount: 100 }];
    component.expenses = [{ date: '2024-01-01', amount: 50 }];
    // Mock ElementRef and getContext
    const mockCtx = {};
    component.incomeLineChartRef = { nativeElement: { getContext: () => mockCtx } } as ElementRef;
    component.expenseLineChartRef = { nativeElement: { getContext: () => mockCtx } } as ElementRef;
    // Spy on Chart constructor directly
    const chartSpy = spyOn<any>(Chart as any, 'call').and.callThrough();
    component.createLineChart();
    expect(chartSpy).toHaveBeenCalled();
  });

  it('should have correct gridStyle', () => {
    expect(component.gridStyle).toEqual({ width: '25%', textAlign: 'center' });
  });
});
