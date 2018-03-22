import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { LoginComponent }    from './login.component';

const loginroutes = [
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [ RouterModule.forChild(loginroutes) ],
  exports: [ RouterModule ],
  declarations:[LoginComponent]
})
export class LoginRouting {}