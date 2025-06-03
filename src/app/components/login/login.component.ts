import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * LoginComponent handles user authentication.
 * It provides a login form, validates user input, and interacts with AuthService for authentication.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /** Reactive form group for login credentials */
  loginForm!: FormGroup;

  /**
   * Constructor injects required services.
   * @param fb FormBuilder for reactive forms
   * @param message NzMessageService for user notifications
   * @param router Router for navigation
   * @param authService AuthService for authentication logic
   */
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Initializes the login form with validation.
   */
  ngOnInit() {
    console.log('[LoginComponent] Initializing login form');
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  /**
   * Handles form submission for login.
   * Validates input, calls AuthService, and navigates on success.
   */
  submitForm() {
    console.log('[LoginComponent] Submit form called', this.loginForm.value);
    if (this.loginForm.invalid) {
      console.warn('[LoginComponent] Form is invalid', this.loginForm.errors);
      this.message.error('Please fill all required fields correctly.', {
        nzDuration: 5000,
      });
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        console.log('[LoginComponent] Login successful', res);
        this.message.success('Login successful!', {
          nzDuration: 5000,
        });
        this.authService.saveCurrentUser(res);
        this.router.navigateByUrl(`/dashboard`);
      },
      error => {
        console.error('[LoginComponent] Login failed', error);
        this.message.error('Login failed!', {
          nzDuration: 5000,
        });
      }
    );
  }

  /**
   * Navigates to the registration page for editing profile.
   */
  editProfile() {
    console.log('[LoginComponent] Navigating to register page');
    this.router.navigateByUrl('/register');
  }
}
