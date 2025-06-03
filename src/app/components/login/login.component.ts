import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.loginForm.invalid) {
      this.message.error('Please fill all required fields correctly.', {
        nzDuration: 5000,
      });
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.message.success('Login successful!', {
          nzDuration: 5000,
        });
        this.authService.saveCurrentUser(res);
        this.router.navigateByUrl(`/dashboard`);
      },
      error => {
        this.message.error('Login failed!', {
          nzDuration: 5000,
        });
      }
    );
  }

  editProfile() {
    this.router.navigateByUrl('/register');
  }
}
