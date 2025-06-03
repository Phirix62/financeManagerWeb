import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateExpenseComponent } from './update-expense.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateExpenseComponent', () => {
  let component: UpdateExpenseComponent;
  let fixture: ComponentFixture<UpdateExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let messageSpy: jasmine.SpyObj<NzMessageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(() => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['getExpenseById', 'updateExpense']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRouteStub = {
      snapshot: { params: { id: 1 } }
    };

    // Default mock implementations to avoid undefined returns
    expenseServiceSpy.getExpenseById.and.returnValue(of({}));
    expenseServiceSpy.updateExpense.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [UpdateExpenseComponent],
      providers: [
        FormBuilder,
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NzMessageService, useValue: messageSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });

    fixture = TestBed.createComponent(UpdateExpenseComponent);
    component = fixture.componentInstance;
    authServiceSpy.getCurrentUser.and.returnValue('testUser');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form and call getExpenseById on ngOnInit', () => {
    spyOn(component, 'getExpenseById');
    component.ngOnInit();
    expect(component.expenseForm).toBeDefined();
    expect(component.getExpenseById).toHaveBeenCalled();
  });

  it('should patch form values when getExpenseById succeeds', fakeAsync(() => {
    const expenseData = {
      title: 'Lunch',
      amount: 20,
      date: '2024-06-01',
      category: 'Food',
      description: 'Lunch with friends',
      user: 'testUser'
    };
    expenseServiceSpy.getExpenseById.and.returnValue(of(expenseData));
    component.ngOnInit();
    tick();
    expect(component.expenseForm.value.title).toBe('Lunch');
    expect(component.expenseForm.value.amount).toBe(20);
    expect(component.expenseForm.value.category).toBe('Food');
  }));

  it('should show error message when getExpenseById fails', fakeAsync(() => {
    expenseServiceSpy.getExpenseById.and.returnValue(throwError(() => new Error('error')));
    component.ngOnInit();
    tick();
    expect(messageSpy.error).toHaveBeenCalledWith('Failed to load expense details', { nzDuration: 5000 });
  }));

  it('should call updateExpense and show success message on submitForm success', fakeAsync(() => {
    component.ngOnInit();
    expenseServiceSpy.updateExpense.and.returnValue(of({}));
    component.expenseForm.setValue({
      title: 'Dinner',
      amount: 30,
      date: '2024-06-02',
      category: 'Food',
      description: 'Dinner with family',
      user: 'testUser'
    });
    component.submitForm();
    tick();
    expect(expenseServiceSpy.updateExpense).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(messageSpy.success).toHaveBeenCalledWith('Expense updated successfully', { nzDuration: 5000 });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/expense');
  }));

  it('should show error message on submitForm failure', fakeAsync(() => {
    component.ngOnInit();
    expenseServiceSpy.updateExpense.and.returnValue(throwError(() => new Error('error')));
    component.expenseForm.setValue({
      title: 'Dinner',
      amount: 30,
      date: '2024-06-02',
      category: 'Food',
      description: 'Dinner with family',
      user: 'testUser'
    });
    component.submitForm();
    tick();
    expect(messageSpy.error).toHaveBeenCalledWith('Failed to update expense', { nzDuration: 5000 });
  }));

  it('should have the correct list of categories', () => {
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
