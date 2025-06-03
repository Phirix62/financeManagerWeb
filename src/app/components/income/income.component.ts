import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IncomeService } from 'src/app/services/income/income.service';

/**
 * IncomeComponent handles the display, creation, and deletion of user incomes.
 * It interacts with IncomeService for CRUD operations and AuthService for user context.
 */
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

  /** List of incomes for the current user */
  incomes: any;

  /** Reactive form for income entry */
  incomeForm: any;

  /** Predefined list of income categories */
  listOfCategory: any[] = [
    'Salary',
    'Business',
    'Investments',
    'Freelancing',
    'Other',
  ];

  /**
   * Constructor injects required services.
   * @param fb FormBuilder for reactive forms
   * @param message NzMessageService for notifications
   * @param router Angular Router
   * @param incomeService Service for income operations
   * @param authService Service for authentication and user info
   */
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService,
    private authService: AuthService
  ) {}

  /**
   * Initializes the component, loads user incomes and sets up the form.
   */
  ngOnInit() {
    console.log('[IncomeComponent] Initializing component');
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

  /**
   * Submits the income form and adds a new income entry.
   */
  submitForm() {
    console.log('[IncomeComponent] Submitting form', this.incomeForm.value);
    this.incomeService.postIncome(this.incomeForm.value).subscribe(
      res => {
        console.log('[IncomeComponent] Income added successfully', res);
        this.message.success('Income added successfully', {
          nzDuration: 5000,
        });
        this.getIncomeByUserId();
      },
      error => {
        console.error('[IncomeComponent] Failed to add income', error);
        this.message.error('Failed to add income', {
          nzDuration: 5000,
        });
      }
    );
  }

  /**
   * Loads all incomes (admin or debug use).
   */
  getAllIncomes() {
    console.log('[IncomeComponent] Fetching all incomes');
    this.incomeService.getAllIncome().subscribe(
      res => {
        console.log('[IncomeComponent] All incomes fetched', res);
        this.incomes = res;
      },
      error => {
        console.error('[IncomeComponent] Failed to load incomes', error);
        this.message.error('Failed to load incomes', {
          nzDuration: 5000,
        });
      }
    );
  }

  /**
   * Loads incomes for the current user.
   */
  getIncomeByUserId() {
    const user = this.authService.getCurrentUser();
    const userId = user.id;
    console.log(`[IncomeComponent] Fetching incomes for userId: ${userId}`);
    this.incomeService.getIncomeByUserId(userId).subscribe(
      res => {
        console.log('[IncomeComponent] User incomes fetched', res);
        this.incomes = res;
      },
      error => {
        console.error('[IncomeComponent] Failed to fetch incomes for user', error);
        this.message.error('Failed to fetch incomes for user', {
          nzDuration: 5000,
        });
      }
    );
  }

  /**
   * Deletes an income entry by its ID.
   * @param id Income ID to delete
   */
  deleteIncome(id: number) {
    console.log(`[IncomeComponent] Deleting income with id: ${id}`);
    this.incomeService.deleteIncome(id).subscribe(
      res => {
        console.log('[IncomeComponent] Income deleted successfully', res);
        this.message.success('Income deleted successfully', {
          nzDuration: 5000,
        });
        this.getIncomeByUserId();
      },
      error => {
        console.error('[IncomeComponent] Failed to delete income', error);
        this.message.error('Failed to delete income', {
          nzDuration: 5000,
        });
      }
    );
  }

}
