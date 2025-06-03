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

/**
 * Component responsible for managing user expenses.
 * 
 * Handles displaying, creating, updating, and deleting expenses for the current user.
 * Integrates with the ExpenseService for backend operations and AuthService for user context.
 */
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent {
  /**
   * Reactive form group for expense creation.
   * @type {FormGroup}
   */
  expenseForm!: FormGroup;

  /**
   * List of available expense categories.
   * @type {any[]}
   */
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

  /**
   * Array holding the user's expenses.
   * @type {any}
   */
  expenses: any;

  /**
   * Initializes the component with required services.
   * 
   * @param fb - FormBuilder for reactive forms
   * @param expenseService - Service for expense CRUD operations
   * @param authService - Service for authentication and user context
   * @param message - Service for displaying messages to the user
   * @param router - Angular Router for navigation
   */
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches expenses for the current user and sets up the expense form.
   */
  ngOnInit() {
    console.log('[ExpenseComponent] Initializing component and fetching user expenses');
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

  /**
   * Submits the expense form and creates a new expense.
   * Displays a success or error message based on the result.
   */
  submitForm() {
    console.log('[ExpenseComponent] Submitting expense form', this.expenseForm.value);
    this.expenseService.postExpense(this.expenseForm.value).subscribe(
      res => {
        this.message.success('Expense added successfully', {
          nzDuration: 5000,
        });
        console.log('[ExpenseComponent] Expense added successfully', res);
        this.getExpenseByUserId();
      },
      error => {
        this.message.error('Failed to add expense', { nzDuration: 5000 });
        console.error('[ExpenseComponent] Failed to add expense', error);
      }
    );
  }

  /**
   * Fetches all expenses from the backend.
   * Used for administrative or debugging purposes.
   */
  getAllExpenses() {
    console.log('[ExpenseComponent] Fetching all expenses');
    this.expenseService.getAllExpense().subscribe(
      res => {
        this.expenses = res;
        console.log('[ExpenseComponent] All expenses:', this.expenses);
      }
    );
  }

  /**
   * Fetches expenses for the currently authenticated user.
   * Updates the local expenses array and handles errors.
   */
  getExpenseByUserId() {
    let userId = this.authService.getCurrentUser().id;
    console.log(`[ExpenseComponent] Fetching expenses for user ID: ${userId}`);
    this.expenseService.getExpenseByUserId(userId).subscribe(
      res => {
        this.expenses = res;
        console.log('[ExpenseComponent] User expenses:', this.expenses);
      },
      error => {
        this.message.error('Failed to fetch expenses for user', { nzDuration: 5000 });
        console.error('[ExpenseComponent] Failed to fetch expenses for user', error);
      }
    );
  }

  /**
   * Navigates to the expense edit page for the given expense ID.
   * 
   * @param id - The ID of the expense to update
   */
  updateExpense(id: number) {
    console.log(`[ExpenseComponent] Navigating to edit expense with ID: ${id}`);
    this.router.navigateByUrl(`/expense/${id}/edit`);
  }

  /**
   * Deletes the expense with the given ID.
   * Displays a success or error message based on the result.
   * 
   * @param id - The ID of the expense to delete
   */
  deleteExpense(id: number) {
    console.log(`[ExpenseComponent] Deleting expense with ID: ${id}`);
    this.expenseService.deleteExpense(id).subscribe(
      res => {
        this.message.success('Expense deleted successfully', {
          nzDuration: 5000,
        });
        console.log('[ExpenseComponent] Expense deleted successfully', res);
        this.getExpenseByUserId();
      },
      error => {
        this.message.error('Failed to delete expense', { nzDuration: 5000 });
        console.error('[ExpenseComponent] Failed to delete expense', error);
      }
    );
  }
}
