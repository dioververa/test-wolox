import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./home/home.module").then(m => m.HomeModule)
      },
      {
        path: "list-techs",
        loadChildren: () =>
          import("./list-technologies/list-technologies.module").then(m => m.ListTechnologiesModule),
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        data: { authGuardRedirect: "/signup" }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
