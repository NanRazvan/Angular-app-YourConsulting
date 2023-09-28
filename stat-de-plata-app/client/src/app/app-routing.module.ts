import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutgoingsComponent } from './components/outgoings/outgoings.component';
import { ActivityComponent } from './components/activity/activity.component';
import { SalaryConfigComponent } from './components/salary-config/salary-config.component';
import { SalaryComponent } from './components/salary/salary.component';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  { path: 'outgoings', component: OutgoingsComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'salaryConfig', component: SalaryConfigComponent },
  { path: 'salary', component: SalaryComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
