import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTechnologiesComponent } from './list-technologies.component';

const routes: Routes = [
  {
    path: '', component: ListTechnologiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTechnologiesRoutingModule { }
