import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';
import { IncomeService } from 'src/app/services/income/income.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {

  incomes :any;
  incomeForm: any;
  listOfCategory: any[] = [
    'Salary',
    'Business',
    'Investments',
    'Freelancing',
    'Other',
  ];

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getIncomeByUserId();
    this.incomeForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      user: [this.authService.getCurrentUser(), Validators.required]
  });
}

  submitForm() {
    this.incomeService.postIncome(this.incomeForm.value).subscribe(
      res => {
        this.message.success('Income added successfully', {
          nzDuration: 5000,
        });
        this.getIncomeByUserId();
      },
      error => {
        this.message.error('Failed to add income', {
          nzDuration: 5000,
        });
      }
    );
  }

  getAllIncomes() {
    this.incomeService.getAllIncome().subscribe(
      res => {
        this.incomes = res;
      },
      error => {
        this.message.error('Failed to load incomes', {
          nzDuration: 5000,
        });
      }
    );
  }

  getIncomeByUserId() {
    let userId = this.authService.getCurrentUser().id;
    this.incomeService.getIncomeByUserId(userId).subscribe(
      res => {
        this.incomes = res;
      },
      error => {
        this.message.error('Failed to fetch incomes for user', {
          nzDuration: 5000,
        });
      }
    );
  }

  deleteIncome(id: number) {
    this.incomeService.deleteIncome(id).subscribe(
      res => {
        this.message.success('Income deleted successfully', {
          nzDuration: 5000,
        });
        this.getIncomeByUserId();
      },
      error => {
        this.message.error('Failed to delete income', {
          nzDuration: 5000,
        });
      }
    );
  }

}
