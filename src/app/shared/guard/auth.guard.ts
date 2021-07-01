import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot, CanActivate,
  CanLoad,
  Route, Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private userService: UserService
  ){}

  canActivate(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let customRedirect = routeSnapshot.data["authGuardRedirect"];
    return this.userService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          let redirect = !!customRedirect ? customRedirect : "/signup";
          this.router.navigate([redirect]);
          return false;
        }
        return true;
      })
    );
  }

  canLoad(route: Route): Observable<boolean> {
    let url: string | undefined = route.path;
    return this.userService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          return false;
        }
        return true;
      })
    );
  }
}
