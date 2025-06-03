import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { DemoNgZorroAntdModule } from 'src/app/DemoNgZorroAntdModule';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let messageServiceSpy: jasmine.SpyObj<NzMessageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['error', 'success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveCurrentUser']);

    TestBed.configureTestingModule({
      imports: [DemoNgZorroAntdModule, ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: NzMessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with username and password controls', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should show error message if form is invalid on submit', () => {
    component.loginForm.setValue({ username: null, password: null });
    component.submitForm();
    expect(messageServiceSpy.error).toHaveBeenCalledWith(
      'Please fill all required fields correctly.',
      { nzDuration: 5000 }
    );
  });

  it('should call AuthService.login and handle success', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    const response = { token: 'abc' };
    authServiceSpy.login.and.returnValue(of(response));

    component.submitForm();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
    expect(messageServiceSpy.success).toHaveBeenCalledWith('Login successful!', { nzDuration: 5000 });
    expect(authServiceSpy.saveCurrentUser).toHaveBeenCalledWith(response);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should call AuthService.login and handle error', () => {
    component.loginForm.setValue({ username: 'user', password: 'pass' });
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.submitForm();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(messageServiceSpy.error).toHaveBeenCalledWith('Login failed!', { nzDuration: 5000 });
  });

  it('should navigate to /register on editProfile', () => {
    component.editProfile();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/register');
  });
});
