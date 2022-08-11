import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetRoutingModule } from './sheet-routing.module';
import { SheetComponent } from './sheet.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SheetComponent
  ],
  imports: [
    CommonModule,
    SheetRoutingModule,
    SharedModule,
    SpreadsheetAllModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SheetComponent
  ]
})
export class SheetModule { }
