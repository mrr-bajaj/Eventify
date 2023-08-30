import { Injectable } from '@angular/core';
import { CanActivate,CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate,CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      // Check if the user's role allows access to the route.
      const roles = this.authService.getUserRoles();
      if (next.data['roles'] && roles.some((role) => next.data['roles'].includes(role))) {
        return true;
      } else {
        // User's role doesn't allow access to the route.
        this.router.navigate(['/login']);
        return false;
      }
    }

    // User is not logged in, redirect to the login page.
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Delegate to canActivate.
    return this.canActivate(next, state);
  }
}