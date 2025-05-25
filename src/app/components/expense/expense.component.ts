import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getAllExpenses();
    this.expenseForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
    });
  }

  submitForm() {
    this.expenseService.postExpense(this.expenseForm.value).subscribe(
      res => {
        this.message.success('Expense added successfully', {
          nzDuration: 5000,
        });
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

}
