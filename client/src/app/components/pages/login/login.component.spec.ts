import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeLoginInfo } from 'src/app/models/employee';
import { EventsService } from 'src/app/services/events/events.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let activatedRoute: ActivatedRoute;
  let authService: AuthService;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [
      'login',
      'getRolesFromToken',
      'setToken',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', [
      'addRegistration',
      'addAttendance',
    ]);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: EventsService, useValue: eventsServiceSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of([{ path: 'login' }]),
            queryParams: of({ id: 'event123' }),
          },
        },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize eventId and buttonSubmitName on ngOnInit', () => {
    component.ngOnInit();

    expect(component.eventId).toBe('event123');
    expect(component.buttonSubmitName).toBe('Attend');
  });

  it('should navigate to signup page on onSignUp when eventId is not present', () => {
    component.eventId = '';

    component.onSignUp();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should navigate to signup page with event id and name on onSignUp when eventId is present', () => {
    component.onSignUp();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { id: 'event123', name: 'attend' },
    });
  });

  it('should set validEmail flag to false for an invalid email', () => {
    const form = { value: { email: 'invalid-email' } } as NgForm;
    component.validEmail = true;

    component.login(form);

    expect(component.validEmail).toBeFalse();
  });

  it('should call AuthService.login with employeeLoginInfo on login form submission', () => {
    const form = {
      value: {
        email: 'valid-email@kongsbergdigital.com',
        password: 'password',
      },
    } as NgForm;
    authServiceSpy.login.and.returnValue(
      of({ message: 'Successful Login', token: 'xyz', roles: 'admin' })
    );
    authServiceSpy.getRolesFromToken.and.returnValue(['admin']);
    authServiceSpy.setToken.and.stub();

    component.login(form);

    const expectedEmployeeLoginInfo: EmployeeLoginInfo = {
      email: 'valid-email@kongsbergdigital.com',
      password: 'password',
    };
    expect(authServiceSpy.login).toHaveBeenCalledWith(
      expectedEmployeeLoginInfo
    );
  });

  it('should show emailNotFound error message when AuthService returns "Email not found"', () => {
    const form = {
      value: {
        email: 'invalid-email@kongsbergdigital.com',
        password: 'password',
      },
    } as NgForm;
    authServiceSpy.login.and.returnValue(of({ error: 'Email not found' }));

    component.login(form);

    expect(component.emailNotFound).toBeTrue();
    expect(component.invalidPassword).toBeFalse();
  });

  it('should show invalidPassword error message when AuthService returns "Invalid password"', () => {
    const form = {
      value: {
        email: 'valid-email@kongsbergdigital.com',
        password: 'invalid-password',
      },
    } as NgForm;
    authServiceSpy.login.and.returnValue(of({ error: 'Invalid password' }));

    component.login(form);

    expect(component.invalidPassword).toBeTrue();
    expect(component.emailNotFound).toBeFalse();
  });

  // Add more test cases to cover other scenarios
});
