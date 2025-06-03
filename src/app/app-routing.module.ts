import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './components/expense/expense.component';
import { UpdateExpenseComponent } from './components/update-expense/update-expense.component';
import { IncomeComponent } from './components/income/income.component';
import { UpdateIncomeComponent } from './components/update-income/update-income.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InvestmentSimulatorComponent } from './components/investment-simulator/investment-simulator.component';

const routes: Routes = [
  {path:"dashboard", component: DashboardComponent},
  {path:"expense", component: ExpenseComponent},
  {path:"income", component: IncomeComponent},
  {path:"expense/:id/edit", component: UpdateExpenseComponent},
  {path:"income/:id/edit", component: UpdateIncomeComponent},
  {path:"", component: LoginComponent},
  {path:"register", component: RegisterComponent},
  {path:"investment-simulator", component: InvestmentSimulatorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
