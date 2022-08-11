import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    SpreadsheetAllModule
  ],
  exports: [
    TestComponent
  ]
})
export class TestModule { }
