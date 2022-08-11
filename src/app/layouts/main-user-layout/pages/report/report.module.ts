import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SpreadsheetAllModule
  ],
  exports: [
    ReportComponent
  ]
})
export class ReportModule { }
