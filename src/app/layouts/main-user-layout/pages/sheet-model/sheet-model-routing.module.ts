import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SheetModelComponent } from './sheet-model.component';

const routes: Routes = [{ path: '', component: SheetModelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetModelRoutingModule { }
