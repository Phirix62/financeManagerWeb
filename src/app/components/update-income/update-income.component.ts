import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IncomeService } from 'src/app/services/income/income.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-update-income',
  templateUrl: './update-income.component.html',
  styleUrls: ['./update-income.component.scss'],
})
export class UpdateIncomeComponent {
  id: number = this.activatedRoute.snapshot.params['id'];
  incomeForm: any;
  listOfCategory: any[] = [
    'Salary',
    'Business',
    'Investments',
    'Freelancing',
    'Other',
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.incomeForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      user: [this.authService.getCurrentUser(), Validators.required],
    });
    this.getIncomeById();
  }

  getIncomeById() {
    this.incomeService.getIncomeById(this.id).subscribe(
      (res) => {
        this.incomeForm.patchValue(res);
      },
      (error) => {
        this.message.error('Failed to load income', {
          nzDuration: 5000,
        });
      }
    );
  }

  submitForm() {
    this.incomeService.updateIncome(this.id, this.incomeForm.value).subscribe(
      (res) => {
        this.message.success('Income updated successfully', {
          nzDuration: 5000,
        });
        this.router.navigateByUrl('/income');
      },
      (error) => {
        this.message.error('Failed to update income', {
          nzDuration: 5000,
        });
      }
    );
  }
}
