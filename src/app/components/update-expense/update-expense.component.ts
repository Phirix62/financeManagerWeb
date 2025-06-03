import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Component for updating an existing expense.
 * Handles fetching the expense by ID, displaying it in a form,
 * and submitting updates to the backend.
 */
@Component({
  selector: 'app-update-expense',
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.scss']
})
export class UpdateExpenseComponent implements OnInit {
  /** Reactive form for expense data */
  expenseForm!: FormGroup;

  /** List of available categories */
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

  /** Expense data (optional, for future use) */
  expenses: any;

  /** Expense ID from route params */
  id: number = this.activatedRoute.snapshot.params['id'];

  /**
   * Constructor for UpdateExpenseComponent
   * @param fb FormBuilder for reactive forms
   * @param expenseService Service for expense API calls
   * @param authService Service for authentication
   * @param message Service for displaying messages
   * @param router Angular Router for navigation
   * @param activatedRoute ActivatedRoute for route params
   */
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Lifecycle hook: initializes the form and loads expense data.
   */
  ngOnInit() {
    console.log('[UpdateExpenseComponent] Initializing component');
    this.expenseForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      user: [this.authService.getCurrentUser(), Validators.required]
    });
    this.getExpenseById();
  }

  /**
   * Fetches the expense by ID and populates the form.
   */
  getExpenseById() {
    console.log(`[UpdateExpenseComponent] Fetching expense with ID: ${this.id}`);
    this.expenseService.getExpenseById(this.id).subscribe(
      res => {
        console.log('[UpdateExpenseComponent] Expense loaded:', res);
        this.expenseForm.patchValue(res);
      },
      error => {
        console.error('[UpdateExpenseComponent] Failed to load expense details', error);
        this.message.error('Failed to load expense details', { nzDuration: 5000 });
      }
    );
  }

  /**
   * Submits the updated expense data to the backend.
   */
  submitForm() {
    console.log('[UpdateExpenseComponent] Submitting form:', this.expenseForm.value);
    this.expenseService.updateExpense(this.id, this.expenseForm.value).subscribe(
      res => {
        console.log('[UpdateExpenseComponent] Expense updated successfully:', res);
        this.message.success('Expense updated successfully', {
          nzDuration: 5000,
        });
        this.router.navigateByUrl('/expense');
      },
      error => {
        console.error('[UpdateExpenseComponent] Failed to update expense', error);
        this.message.error('Failed to update expense', { nzDuration: 5000 });
      }
    );
  }
}
