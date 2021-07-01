import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

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
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required]],
      province: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.reEmail), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(this.rePhone)]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const confirmPassword = group.get('confirmPassword').value;
    const newPassword = group.get('newPassword').value;

    return newPassword === confirmPassword ? null : { notSame: true };
  }

  getProvinces(){
    return this.countrys.find(item => item.name === this.signupForm.get('country').value).provinces;
  }

  onSubmit() {
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