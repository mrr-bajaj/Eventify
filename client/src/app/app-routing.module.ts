import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { DashboardComponent } from './components/pages/admin/dashboard/dashboard.component';
import { EventsComponent } from './components/pages/admin/events/events.component';
import { EmployeesComponent } from './components/pages/admin/employees/employees.component';
import { AdminRolesComponent } from './components/pages/admin/admin-roles/admin-roles.component';
import { AddEventComponent } from './components/pages/admin/events/add-event/add-event.component';
import { EventInfoComponent } from './components/pages/shared/event-info/event-info.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { EmployeeInfoComponent } from './components/pages/shared/employee-info/employee-info.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      { path: 'events', redirectTo: '', component: LoginComponent },
      { path: 'events/:id', component: LoginComponent },
    ],
  },
  { path: 'register', component: LoginComponent },
  { path: 'register/:id', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'events/:id',
        component: EventInfoComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'employees/:id',
        component: EmployeeInfoComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'admin-roles',
        component: AdminRolesComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'add-event',
        component: AddEventComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'edit-event',
        component: AddEventComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'edit-event/:id',
        component: AddEventComponent,
        canActivateChild: [AuthGuard],
      },
    ],
  },
  {
    path: 'user',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user'] },
    children: [
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full',
        canActivateChild: [AuthGuard],
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivateChild: [AuthGuard],
      },
      {
        path: 'employees/:id',
        component: EmployeeInfoComponent,
        canActivateChild: [AuthGuard],
      }
     ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
