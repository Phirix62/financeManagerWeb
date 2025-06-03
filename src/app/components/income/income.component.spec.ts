import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeComponent } from './income.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IncomeService } from 'src/app/services/income/income.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;

  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let messageServiceSpy: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', [
      'getIncomeByUserId',
      'getAllIncome',
      'postIncome',
      'deleteIncome'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [IncomeComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, DemoNgZorroAntdModule, BrowserAnimationsModule],
      providers: [
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    authServiceSpy.getCurrentUser.and.returnValue({ id: 123 });
    incomeServiceSpy.getIncomeByUserId.and.returnValue(of([]));

    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    expect(component.incomeForm).toBeDefined();
    expect(component.incomeForm.controls['user'].value).toEqual({ id: 123 });
  });

  it('should get incomes by user id on ngOnInit', () => {
    expect(incomeServiceSpy.getIncomeByUserId).toHaveBeenCalledWith(123);
  });

  it('should submit form and show success message', () => {
    component.incomeForm.setValue({
      title: 'Freelance',
      amount: 300,
      date: '2024-06-01',
      category: 'Freelancing',
      description: 'Dev work',
      user: { id: 123 }
    });

    incomeServiceSpy.postIncome.and.returnValue(of({}));
    spyOn(component, 'getIncomeByUserId');

    component.submitForm();

    expect(incomeServiceSpy.postIncome).toHaveBeenCalled();
    expect(messageServiceSpy.success).toHaveBeenCalledWith('Income added successfully', { nzDuration: 5000 });
    expect(component.getIncomeByUserId).toHaveBeenCalled();
  });

  it('should show error message when submitForm fails', () => {
    component.incomeForm.setValue({
      title: 'Freelance',
      amount: 300,
      date: '2024-06-01',
      category: 'Freelancing',
      description: 'Dev work',
      user: { id: 123 }
    });

    incomeServiceSpy.postIncome.and.returnValue(throwError(() => new Error('fail')));
    component.submitForm();

    expect(messageServiceSpy.error).toHaveBeenCalledWith('Failed to add income', { nzDuration: 5000 });
  });

  it('should fetch all incomes', () => {
    const mockIncomes = [{ id: 1 }];
    incomeServiceSpy.getAllIncome.and.returnValue(of(mockIncomes));

    component.getAllIncomes();

    expect(component.incomes).toEqual(mockIncomes);
  });

  it('should show error if getAllIncomes fails', () => {
    incomeServiceSpy.getAllIncome.and.returnValue(throwError(() => new Error('fail')));
    component.getAllIncomes();

    expect(messageServiceSpy.error).toHaveBeenCalledWith('Failed to load incomes', { nzDuration: 5000 });
  });

  it('should fetch incomes by user', () => {
    const mockIncomes = [{ id: 1 }];
    incomeServiceSpy.getIncomeByUserId.and.returnValue(of(mockIncomes));

    component.getIncomeByUserId();

    expect(component.incomes).toEqual(mockIncomes);
  });

  it('should show error if getIncomeByUserId fails', () => {
    incomeServiceSpy.getIncomeByUserId.and.returnValue(throwError(() => new Error('fail')));

    component.getIncomeByUserId();

    expect(messageServiceSpy.error).toHaveBeenCalledWith('Failed to fetch incomes for user', { nzDuration: 5000 });
  });

  it('should delete income and refresh list', () => {
    incomeServiceSpy.deleteIncome.and.returnValue(of({}));
    spyOn(component, 'getIncomeByUserId');

    component.deleteIncome(1);

    expect(incomeServiceSpy.deleteIncome).toHaveBeenCalledWith(1);
    expect(messageServiceSpy.success).toHaveBeenCalledWith('Income deleted successfully', { nzDuration: 5000 });
    expect(component.getIncomeByUserId).toHaveBeenCalled();
  });

  it('should show error if deleteIncome fails', () => {
    incomeServiceSpy.deleteIncome.and.returnValue(throwError(() => new Error('fail')));

    component.deleteIncome(1);

    expect(messageServiceSpy.error).toHaveBeenCalledWith('Failed to delete income', { nzDuration: 5000 });
  });

  it('should have correct listOfCategory values', () => {
    expect(component.listOfCategory).toEqual([
      'Salary',
      'Business',
      'Investments',
      'Freelancing',
      'Other',
    ]);
  });
});
