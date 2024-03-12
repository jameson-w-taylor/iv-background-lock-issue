import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthActionCompletePage } from './auth-action-complete.page';

const routes: Routes = [
  {
    path: '',
    component: AuthActionCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthActionCompletePageRoutingModule {}
