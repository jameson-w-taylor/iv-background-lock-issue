import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthActionCompletePageRoutingModule } from './auth-action-complete-routing.module';

import { AuthActionCompletePage } from './auth-action-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthActionCompletePageRoutingModule
  ],
  declarations: [AuthActionCompletePage]
})
export class AuthActionCompletePageModule {}
