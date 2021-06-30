import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { map, take } from "rxjs/operators";
import { AppConfig, APP_CONFIG } from "src/app/app-config.module";
import { User } from "../models/user";

@Injectable()
export class UserService {
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  private urlBase: string = "http://localhost:3000";

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(APP_CONFIG) private configMain: AppConfig
  ) {
    this.urlBase = this.configMain.apiEndpoint;
    if (this.validateDateExpToken()) this.loggedIn.next(true);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: any; nameUser: string }>(
        `${this.urlBase}/login`,
        { email: email, password: password }
      )
      .pipe(
        take(1),
        map(
          resp => {
            if (resp && resp.token) {
              this.setUserLocalStorage(resp);
            }
            return resp;
          },
          err => {
            console.error("Error occured err: ", err);
          }
        )
      );
  }

  getNameUser() {
    return JSON.parse(localStorage.getItem("nameUser") || '{}');
  }

  getRoleUser() {
    return JSON.parse(localStorage.getItem("role") || '{}');
  }

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("nameUser");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    this.loggedIn.next(false);
    this.router.navigate(["/login"]);
  }

  validateDateExpToken(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  getUserDetails() {
    const token = localStorage.getItem("auth_token");
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  goLoggin() {
    this.router.navigate(["/login"]);
  }

  goSignup() {
    this.router.navigate(["/signup"]);
  }

  create(user: User) {
    return this.http
      .post<{ token: string; user: string; nameUser: string }>(
        `${this.urlBase}/signup`,
        user
      )
      .pipe(
        take(1),
        map(
          resp => {
            //console.log('UserService create resp: ', resp);
            if (resp && resp.token) {
              this.setUserLocalStorage(resp);
            }
            return resp;
          },
          err => {
            console.error("UserService create err: ", err);
          }
        )
      );
  }

  setUserLocalStorage(resp) {
    localStorage.setItem("currentUser", JSON.stringify(resp.user));
    localStorage.setItem("nameUser", JSON.stringify(resp.nameUser));
    localStorage.setItem("auth_token", resp.token);
    localStorage.setItem("role", JSON.stringify(resp.role));
    this.loggedIn.next(true);
  }
}
