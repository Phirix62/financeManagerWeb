import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let messageServiceSpy: jasmine.SpyObj<NzMessageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['error', 'success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: NzMessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registerForm with controls', () => {
    expect(component.registerForm.contains('username')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
  });

  it('should show error message if form is invalid on submit', () => {
    component.registerForm.setValue({ username: '', email: '', password: '' });
    component.submitForm();
    expect(messageServiceSpy.error).toHaveBeenCalledWith(
      'Please fill all required fields correctly.',
      { nzDuration: 5000 }
    );
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call authService.register and show success message on valid form', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    authServiceSpy.register.and.returnValue(of({}));
    component.submitForm();
    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(messageServiceSpy.success).toHaveBeenCalledWith(
      'Registration successful!',
      { nzDuration: 5000 }
    );
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('should show error message if registration fails', () => {
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));
    component.submitForm();
    expect(messageServiceSpy.error).toHaveBeenCalledWith(
      'Registration failed!',
      { nzDuration: 5000 }
    );
  });
});
