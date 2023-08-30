import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear(); // Clear local storage after each test
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should set and get the token', () => {
    const testToken = 'test-token';
    authService.setToken(testToken);

    expect(authService.getToken()).toEqual(testToken);
  });

  it('should return true for isLoggedIn if a token is present', () => {
    const testToken = 'test-token';
    authService.setToken(testToken);

    expect(authService.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn if no token is present', () => {
    expect(authService.isLoggedIn()).toBeFalse();
  });


  // Add more test cases for signup and login methods if needed.

});
