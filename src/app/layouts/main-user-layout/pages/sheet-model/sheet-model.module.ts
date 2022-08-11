import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetModelRoutingModule } from './sheet-model-routing.module';
import { SheetModelComponent } from './sheet-model.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';


@NgModule({
  declarations: [
    SheetModelComponent
  ],
  imports: [
    CommonModule,
    SheetModelRoutingModule,
    SpreadsheetAllModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    SheetModelComponent
  ]
})
export class SheetModelModule { }
