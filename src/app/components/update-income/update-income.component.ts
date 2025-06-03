import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IncomeService } from 'src/app/services/income/income.service';
import { AuthService } from 'src/app/services/auth/auth.service';

/**
 * Component for updating an existing income entry.
 * Handles form initialization, data fetching, and update submission.
 */
@Component({
  selector: 'app-update-income',
  templateUrl: './update-income.component.html',
  styleUrls: ['./update-income.component.scss'],
})
export class UpdateIncomeComponent implements OnInit {
  /** Income ID from route parameters */
  id: number = this.activatedRoute.snapshot.params['id'];
  /** Reactive form for income data */
  incomeForm: any;
  /** List of available income categories */
  listOfCategory: any[] = [
    'Salary',
    'Business',
    'Investments',
    'Freelancing',
    'Other',
  ];

  /**
   * Constructor for UpdateIncomeComponent.
   * @param fb FormBuilder for reactive forms
   * @param message NzMessageService for notifications
   * @param router Router for navigation
   * @param incomeService Service for income operations
   * @param authService Service for authentication
   * @param activatedRoute ActivatedRoute for route parameters
   */
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Initializes the form and loads income data by ID.
   */
  ngOnInit() {
    console.log('[UpdateIncomeComponent] Initializing component');
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

  /**
   * Fetches income data by ID and populates the form.
   */
  getIncomeById() {
    console.log(`[UpdateIncomeComponent] Fetching income with ID: ${this.id}`);
    this.incomeService.getIncomeById(this.id).subscribe(
      (res) => {
        console.log('[UpdateIncomeComponent] Income data loaded', res);
        this.incomeForm.patchValue(res);
      },
      (error) => {
        console.error('[UpdateIncomeComponent] Failed to load income', error);
        this.message.error('Failed to load income', {
          nzDuration: 5000,
        });
      }
    );
  }

  /**
   * Submits the updated income data.
   */
  submitForm() {
    console.log('[UpdateIncomeComponent] Submitting form', this.incomeForm.value);
    this.incomeService.updateIncome(this.id, this.incomeForm.value).subscribe(
      (res) => {
        console.log('[UpdateIncomeComponent] Income updated successfully', res);
        this.message.success('Income updated successfully', {
          nzDuration: 5000,
        });
        this.router.navigateByUrl('/income');
      },
      (error) => {
        console.error('[UpdateIncomeComponent] Failed to update income', error);
        this.message.error('Failed to update income', {
          nzDuration: 5000,
        });
      }
    );
  }
}
