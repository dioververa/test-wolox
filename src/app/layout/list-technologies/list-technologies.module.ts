import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTechnologiesRoutingModule } from './list-technologies-routing.module';
import { ListTechnologiesComponent } from './list-technologies.component';


@NgModule({
  declarations: [ListTechnologiesComponent],
  imports: [
    CommonModule,
    ListTechnologiesRoutingModule
  ]
})
export class ListTechnologiesModule { }
