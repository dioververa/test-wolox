import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then(m => m.SignupModule)
  },
  {
    path: "",
    loadChildren: () =>
      import("./layout/layout.module").then(m => m.LayoutModule)
  },
  { path: "**", redirectTo: "not-found" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
