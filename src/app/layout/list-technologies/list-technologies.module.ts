import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTechnologiesRoutingModule } from './list-technologies-routing.module';
import { ListTechnologiesComponent } from './list-technologies.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ListTechnologiesComponent],
  imports: [
    CommonModule,
    ListTechnologiesRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot()
  ]
})
export class ListTechnologiesModule { }
