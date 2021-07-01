import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [
    trigger('routerTransition', [
      state('void', style({})),
      state('*', style({})),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {

  faEyeSlash = faEyeSlash;
  faEye = faEye;
  reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  rePhone = /^\d+$/;
  signupForm: FormGroup;
  loading = false;
  error: string;
  hideNewPassword = true;
  matcher = new ConfirmPasswordErrorStateMatcher();

  countrys = [ 
    {
      name: 'Argentina',
      provinces: [ 'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza' , 'Chaco']
    },
    {
      name: 'Chile',
      provinces: [ 'Bolívar', 'Boyacá', 'Caldas', 'Cauca', 'Magdalena']
    },
    {
      name: 'Colombia',
      provinces: ['']
    },
    {
      name: 'México',
      provinces: ['']
    },
    {
      name: 'Perú',
      provinces: ['']
    }
  ];
  provinces$: Observable<Array<string>>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getSignupForm();
  }

  getSignupForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      country: ['', [Validators.required]],
      province: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.reEmail), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(this.rePhone)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkPasswords });

    this.provinces$ = this.signupForm.get('country').valueChanges
    .pipe(map(() => this.getProvinces()));
  }

  checkPasswords(group: FormGroup) {
    const confirmPassword = group.get('confirmPassword').value;
    const newPassword = group.get('newPassword').value;

    return newPassword === confirmPassword ? null : { notSame: true };
  }

  getProvinces(){
    return (this.countrys.find(item => item.name === this.signupForm.get('country').value) || {} as any)?.provinces;
  }

  onSubmit() {

    if (this.signupForm.invalid) return;

    const user = {
      "name": this.signupForm.get('firstName').value,
      "last_name": this.signupForm.get('lastName').value,
      "country": this.signupForm.get('country').value,
      "province": this.signupForm.get('province').value,
      "mail": this.signupForm.get('email').value,
      "phone": this.signupForm.get('phoneNumber').value,
      "password": this.signupForm.get('newPassword').value
    }
    this.userService.create(user)
    .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }

}

export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (control?.parent?.dirty) {
      if (!control.touched) {
        if (control.hasError('required')) {
          return control?.parent?.hasError('notSame');
        } else {
          return control?.invalid || control?.parent?.hasError('notSame');
        }
      } else {
        return control?.invalid || control?.parent?.hasError('notSame');
      }
    } else {
      return false;
    }
  }
}