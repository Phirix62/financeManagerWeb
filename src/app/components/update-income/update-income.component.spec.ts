import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateIncomeComponent } from './update-income.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IncomeService } from 'src/app/services/income/income.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

describe('UpdateIncomeComponent', () => {
  let component: UpdateIncomeComponent;
  let fixture: ComponentFixture<UpdateIncomeComponent>;
  let mockIncomeService: any;
  let mockAuthService: any;
  let mockMessageService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockIncomeService = {
      getIncomeById: jasmine.createSpy('getIncomeById').and.returnValue(of({
        title: 'Test',
        amount: 100,
        date: '2024-01-01',
        category: 'Salary',
        description: 'Test desc',
        user: 'user1'
      })),
      updateIncome: jasmine.createSpy('updateIncome').and.returnValue(of({}))
    };
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue('user1')
    };
    mockMessageService = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success')
    };
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    mockActivatedRoute = {
      snapshot: { params: { id: 1 } }
    };

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [UpdateIncomeComponent],
      providers: [
        FormBuilder,
        { provide: IncomeService, useValue: mockIncomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NzMessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(UpdateIncomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form and call getIncomeById on ngOnInit', () => {
    spyOn(component, 'getIncomeById');
    component.ngOnInit();
    expect(component.incomeForm).toBeDefined();
    expect(component.getIncomeById).toHaveBeenCalled();
  });

  it('should patch form values on successful getIncomeById', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(component.incomeForm.value.title).toBe('Test');
    expect(component.incomeForm.value.amount).toBe(100);
    expect(component.incomeForm.value.category).toBe('Salary');
  }));

  it('should show error message if getIncomeById fails', fakeAsync(() => {
    mockIncomeService.getIncomeById.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    expect(mockMessageService.error).toHaveBeenCalledWith('Failed to load income', { nzDuration: 5000 });
  }));

  it('should call updateIncome and show success message on submitForm', fakeAsync(() => {
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    component.submitForm();
    tick();
    expect(mockIncomeService.updateIncome).toHaveBeenCalledWith(1, component.incomeForm.value);
    expect(mockMessageService.success).toHaveBeenCalledWith('Income updated successfully', { nzDuration: 5000 });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/income');
  }));

  it('should show error message if updateIncome fails', fakeAsync(() => {
    mockIncomeService.updateIncome.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    component.submitForm();
    tick();
    expect(mockMessageService.error).toHaveBeenCalledWith('Failed to update income', { nzDuration: 5000 });
  }));

  it('should have correct listOfCategory', () => {
    expect(component.listOfCategory).toEqual([
      'Salary',
      'Business',
      'Investments',
      'Freelancing',
      'Other',
    ]);
  });
});
