import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { LoginComponent } from './components/pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminComponent } from './components/pages/admin/admin.component';
import { DashboardComponent } from './components/pages/admin/dashboard/dashboard.component';
import { EventsComponent } from './components/pages/admin/events/events.component';
import { EmployeesComponent } from './components/pages/admin/employees/employees.component';
import { SidebarComponent } from './components/pages/shared/sidebar/sidebar.component';
import { HeaderComponent } from './components/pages/shared/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card'
import { MatTableModule } from '@angular/material/table';
import { AdminRolesComponent } from './components/pages/admin/admin-roles/admin-roles.component';
import { EventCardComponent } from './components/pages/shared/event-card/event-card.component';
import { AddEventComponent } from './components/pages/admin/events/add-event/add-event.component';
import { EventInfoComponent } from './components/pages/shared/event-info/event-info.component';
import { TableComponent } from './components/pages/shared/table/table.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SearchPipe } from './components/pages/shared/search/search.pipe';
import { SearchComponent } from './components/pages/shared/search/search.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { EmployeeInfoComponent } from './components/pages/shared/employee-info/employee-info.component';
import { PieComponent } from './components/pages/shared/charts/pie/pie.component';
import { DataCardComponent } from './components/pages/shared/data-card/data-card.component';
import { LineChartComponent } from './components/pages/shared/charts/line-chart/line-chart.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ConfirmationDialogComponent } from './components/pages/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BarComponent } from './components/pages/shared/charts/bar/bar.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    EventsComponent,
    EmployeesComponent,
    SidebarComponent,
    HeaderComponent,
    AdminRolesComponent,
    EventCardComponent,
    AddEventComponent,
    EventInfoComponent,
    TableComponent,
    SearchPipe,
    SearchComponent,
    PageNotFoundComponent,
    EmployeeInfoComponent,
    PieComponent,
    DataCardComponent,
    LineChartComponent,
    ConfirmationDialogComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    DatePipe,
    MatCardModule,
    MatTableModule,
    CanvasJSAngularChartsModule,
    MatDialogModule
  ],
  providers: [AuthGuard,SearchPipe,DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
