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
    if (this.validateTokenExist()) this.loggedIn.next(true);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string}>(
        `${this.urlBase}/login`,
        { email: email, password: password }
      )
      .pipe(
        take(1),
        map(
          resp => {
            if (resp && resp.token) {
              this.setUserLocalStorage(resp.token, {email: email});
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
    return JSON.parse((localStorage.getItem("user") || '{}')).name || '';
  }

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("favorites");
    this.loggedIn.next(false);
    this.router.navigate(["/signup"]);
  }

  validateTokenExist() {
    return localStorage.getItem("auth_token");
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
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
            if (resp && resp.token) {
              this.setUserLocalStorage(resp.token, user);
              this.router.navigate(["/list-techs"]);
            }
            return resp;
          },
          err => {
            console.error("UserService create err: ", err);
          }
        )
      );
  }

  setUserLocalStorage(token, user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
    this.loggedIn.next(true);
  }
}
