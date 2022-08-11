import { HttpClient, HttpParameterCodec } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {
  @Input() row: any;


  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    /*this.http.post(environment.api+'getFilePath', {}).subscribe(res => {
    })*/
  }

  ngAfterViewInit() {
    this.http.post(environment.api+'getFilePath', {}).subscribe(url => {
      console.log('============',url);
    })
  }

}
