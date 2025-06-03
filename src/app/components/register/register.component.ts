import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * RegisterComponent handles user registration.
 * It provides a form for users to enter their username, email, and password,
 * validates the input, and communicates with the AuthService to register the user.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  /**
   * Reactive form group for registration.
   */
  registerForm: FormGroup;

  /**
   * Creates an instance of RegisterComponent.
   * @param fb FormBuilder for creating the form group.
   * @param message NzMessageService for displaying messages.
   * @param router Router for navigation.
   * @param authService AuthService for registration API calls.
   */
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Initializes the registration form with validation.
   */
  ngOnInit() {
    console.log('[RegisterComponent] Initializing registration form');
    this.registerForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  /**
   * Handles form submission for registration.
   * Validates the form and calls the AuthService to register the user.
   */
  submitForm() {
    console.log('[RegisterComponent] Submitting registration form', this.registerForm.value);
    if (this.registerForm.invalid) {
      console.warn('[RegisterComponent] Form is invalid', this.registerForm.errors);
      this.message.error('Please fill all required fields correctly.', {
        nzDuration: 5000,
      });
      return;
    }
    this.authService.register(this.registerForm.value).subscribe(
      res => {
        console.log('[RegisterComponent] Registration successful', res);
        this.message.success('Registration successful!', {
          nzDuration: 5000,
        });
        this.router.navigateByUrl(``);
      },
      error => {
        console.error('[RegisterComponent] Registration failed', error);
        this.message.error('Registration failed!', {
          nzDuration: 5000,
        });
      }
    );
  }
}
