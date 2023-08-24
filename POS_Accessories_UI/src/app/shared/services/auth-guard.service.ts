import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser: any = this.accountService.getUserInfo();

    if (currentUser) {
      // here we need to use the passed object role
      if (route.data.roles && route.data.roles.indexOf(currentUser.userRoleId) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/not-found'], { state: {error: 'Not Authorized'} });
        return false;
      }

      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;

  }

}
