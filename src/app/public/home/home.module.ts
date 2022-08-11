import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { LoginModule } from '../auth/login/login.module';
import { SignupModule } from '../auth/signup/signup.module';
import { ResetRequestModule } from '../auth/reset-request/reset-request.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    LoginModule,
    SignupModule,
    ResetRequestModule
  ]
})
export class HomeModule { }
