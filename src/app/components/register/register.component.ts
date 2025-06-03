import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: any;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.registerForm.invalid) {
      this.message.error('Please fill all required fields correctly.', {
        nzDuration: 5000,
      });
      return;
    }
    this.authService.register(this.registerForm.value).subscribe(
      res => {
        this.message.success('Registration successful!', {
          nzDuration: 5000,
        });
        this.router.navigateByUrl(``);
      },
      error => {
        this.message.error('Registration failed!', {
          nzDuration: 5000,
        });
      }
    );
  }
}
