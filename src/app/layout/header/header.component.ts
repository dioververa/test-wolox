import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import {
  faBars,
  faPlus, faPowerOff, faUserCircle, faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { UserService } from "../../shared/services/user.service";

@Component({
  selector: "app-header",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  isLoggedIn$: Observable<boolean>;
  profile$: Observable<boolean>;
  selectedLang = "en";

  faUserCircle = faUserCircle;
  faPowerOff = faPowerOff;
  faBars = faBars;
  faPlus = faPlus;
  faLanguage = faLanguage;

  profile: any = {};
  openedMenuResposive = false;

  constructor(
    public router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['en','es']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  ngOnInit() {

    this.isLoggedIn$ = this.userService.loggedIn$.pipe(share());
    this.profile$ = this.isLoggedIn$
      .pipe(
        map(resp => resp ? this.userService.getNameUser() : false)
      )
  }

  signup() {
    this.userService.goSignup();
  }

  onLoggedout() {
    this.userService.logout();
  }

  onChangeLanguaje(languaje){
    this.translate.use(languaje);
  }

  ngOnDestroy() {
  }
}
