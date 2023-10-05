import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {NewpasswordComponent} from './newpassword/newpassword.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full',
  }, {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'Login/:id',
    redirectTo: 'Login',
    pathMatch: 'full',
  }, {
    path: 'Login/:id',
    component: LoginComponent,
  },
  {
    path: 'password_reset/:id',
    redirectTo: 'password_reset',
    pathMatch: 'full',
  }, {
    path: 'password_reset/:id',
    component: NewpasswordComponent,
  },
  {
    path: 'ConfirmMail',
    redirectTo: 'Confirmmail',
    pathMatch: 'full',
  }, {
    path: 'ConfirmMail',
    component: ConfirmmailComponent,
  },
  {
    path: 'ForgotPassword',
    redirectTo: 'ForgotPassword',
    pathMatch: 'full',
  }, {
    path: 'ForgotPassword',
    component: ForgetPasswordComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
