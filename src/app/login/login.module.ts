import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouting } from './login.routing.module';
import { LoginService } from './login.service';

@NgModule({
  imports: [
    CommonModule,
    LoginRouting
  ],
  declarations: [],
  providers: [LoginService]
})
export class LoginModule { }
