import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent {
  expenseForm!: FormGroup;
  listOfCategory: any[] = [
    'Food',
    'Transport',
    'Utilities',
    'Clothing',
    'Investments',
    'Entertainment',
    'Healthcare',
    'Other',
  ];
  expenses:any;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getExpenseByUserId();
    this.expenseForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      user: [this.authService.getCurrentUser(), Validators.required],
    });
  }

  submitForm() {
    this.expenseService.postExpense(this.expenseForm.value).subscribe(
      res => {
        this.message.success('Expense added successfully', {
          nzDuration: 5000,
        });
        this.getExpenseByUserId();
      },
      error => {
        this.message.error('Failed to add expense', { nzDuration: 5000 });
      }
    );
  }

  getAllExpenses() {
    this.expenseService.getAllExpense().subscribe(
      res => {
        this.expenses = res;
        console.log(this.expenses);
      }
    );
  }

  getExpenseByUserId() {
    let userId = this.authService.getCurrentUser().id;
    this.expenseService.getExpenseByUserId(userId).subscribe(
      res => {
        this.expenses = res;
        console.log(this.expenses);
      },
      error => {
        this.message.error('Failed to fetch expenses for user', { nzDuration: 5000 });
      }
    );
  }

  updateExpense(id: number) {
    this.router.navigateByUrl(`/expense/${id}/edit`);
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpense(id).subscribe(
      res => {
        this.message.success('Expense deleted successfully', {
          nzDuration: 5000,
        });
        this.getExpenseByUserId();
      },
      error => {
        this.message.error('Failed to delete expense', { nzDuration: 5000 });
      }
    );
  }

}
