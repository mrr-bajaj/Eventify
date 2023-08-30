import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SignupComponent } from './signup.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Employee } from 'src/app/models/employee';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  const fakeEmployee: Employee = {
    name: 'John Doe',
    email: 'johndoe@kongsbergdigital.com',
    department: 'Digital Energy',
    location: 'India',
    gender: 'Male'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ id: 'event123', name: 'attend' }) } }
      ]
    }).compileComponents();
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page on successful registration', () => {
    authService.signup.and.returnValue(of({ message: 'Employee registered successfully' }));
    spyOn(component, 'navigateToLoginPage');

    component.signup({ value: fakeEmployee } as any);

    expect(component.navigateToLoginPage).toHaveBeenCalled();
  });

  it('should show error message when email already registered', () => {
    authService.signup.and.returnValue(of({ error: 'Email already registered' }));
    component.signup({ value: fakeEmployee } as any);

    expect(component.existingEmail).toBeTrue();
  });

  it('should set validEmail flag to false for invalid email format', () => {
    const invalidEmailEmployee = { ...fakeEmployee, email: 'invalid-email' };
    component.signup({ value: invalidEmailEmployee } as any);

    expect(component.validEmail).toBeFalse();
  });


  // Add more test cases to cover other scenarios
});
