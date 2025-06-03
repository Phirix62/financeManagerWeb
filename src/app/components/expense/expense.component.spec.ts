import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseComponent } from './expense.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ExpenseComponent', () => {
  let component: ExpenseComponent;
  let fixture: ComponentFixture<ExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let messageSpy: jasmine.SpyObj<NzMessageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', [
      'postExpense',
      'getAllExpense',
      'getExpenseByUserId',
      'deleteExpense'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    authServiceSpy.getCurrentUser.and.returnValue({ id: 1, name: 'Test User' });
    expenseServiceSpy.getExpenseByUserId.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, ReactiveFormsModule, RouterTestingModule, BrowserAnimationsModule, RouterModule],
      declarations: [ExpenseComponent],
      providers: [
        FormBuilder,
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NzMessageService, useValue: messageSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    fixture = TestBed.createComponent(ExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch expenses on ngOnInit', () => {
    const mockExpenses = [{ id: 1, title: 'Test Expense' }];
    expenseServiceSpy.getExpenseByUserId.and.returnValue(of(mockExpenses));
    component.ngOnInit();
    expect(component.expenseForm).toBeDefined();
    expect(expenseServiceSpy.getExpenseByUserId).toHaveBeenCalledWith(1);
  });

  it('should submit form and show success message', () => {
    component.expenseForm = component['fb'].group({
      title: ['Groceries'],
      amount: [100],
      date: ['2024-06-01'],
      category: ['Groceries'],
      description: ['Weekly groceries'],
      user: [{ id: 1, name: 'Test User' }]
    });
    expenseServiceSpy.postExpense.and.returnValue(of({}));
    spyOn(component, 'getExpenseByUserId');
    component.submitForm();
    expect(expenseServiceSpy.postExpense).toHaveBeenCalled();
    expect(messageSpy.success).toHaveBeenCalledWith('Expense added successfully', { nzDuration: 5000 });
    expect(component.getExpenseByUserId).toHaveBeenCalled();
  });

  it('should show error message on failed submit', () => {
    component.expenseForm = component['fb'].group({
      title: ['Groceries'],
      amount: [100],
      date: ['2024-06-01'],
      category: ['Groceries'],
      description: ['Weekly groceries'],
      user: [{ id: 1, name: 'Test User' }]
    });
    expenseServiceSpy.postExpense.and.returnValue(throwError(() => new Error('Error')));
    component.submitForm();
    expect(messageSpy.error).toHaveBeenCalledWith('Failed to add expense', { nzDuration: 5000 });
  });

  it('should get all expenses', () => {
    const mockExpenses = [{ id: 1, title: 'Test Expense' }];
    expenseServiceSpy.getAllExpense.and.returnValue(of(mockExpenses));
    spyOn(console, 'log');
    component.getAllExpenses();
    expect(component.expenses).toEqual(mockExpenses);
    expect(console.log).toHaveBeenCalledWith(mockExpenses);
  });

  it('should get expenses by user id and handle error', () => {
    expenseServiceSpy.getExpenseByUserId.and.returnValue(throwError(() => new Error('Error')));
    component.getExpenseByUserId();
    expect(messageSpy.error).toHaveBeenCalledWith('Failed to fetch expenses for user', { nzDuration: 5000 });
  });

  it('should navigate to update expense', () => {
    component.updateExpense(5);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/expense/5/edit');
  });

  it('should delete expense and refresh list', () => {
    expenseServiceSpy.deleteExpense.and.returnValue(of({}));
    spyOn(component, 'getExpenseByUserId');
    component.deleteExpense(2);
    expect(expenseServiceSpy.deleteExpense).toHaveBeenCalledWith(2);
    expect(messageSpy.success).toHaveBeenCalledWith('Expense deleted successfully', { nzDuration: 5000 });
    expect(component.getExpenseByUserId).toHaveBeenCalled();
  });

  it('should show error message on failed delete', () => {
    expenseServiceSpy.deleteExpense.and.returnValue(throwError(() => new Error('Error')));
    component.deleteExpense(3);
    expect(messageSpy.error).toHaveBeenCalledWith('Failed to delete expense', { nzDuration: 5000 });
  });

  it('should have correct listOfCategory values', () => {
    expect(component.listOfCategory).toEqual([
      'Food',
      'Transport',
      'Utilities',
      'Clothing',
      'Investments',
      'Entertainment',
      'Healthcare',
      'Other',
    ]);
  });
});
