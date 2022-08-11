import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { environment } from 'src/environments/environment';
import { TokenService } from '../shared/services/auth/token.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild('spreadsheet')
  public spreadsheetObj!: SpreadsheetComponent;
  async created () {
    await fetch("http://127.0.0.1:8000/excels/ValuationModelEndeavourUpdated.xlsx") // fetch the remote url
      .then((response) => {
        response.blob().then((fileBlob) => { // convert the excel file to blob
        let file = new File([fileBlob], "Sample.xlsx"); //convert the blob into file
        this.spreadsheetObj.open({ file: file }); // open the file into Spreadsheet
        })
      })
  }

  @Input() row: any;

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) { }

  ngOnInit(): void {
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.token.getToken()})
    };
    this.http.post(environment.api+'me', {headers: httpOptions}).subscribe(res => {
      console.log(res);
    });
  }

  ngAfterViewInit() {
    //this.created();
  }

  ngAfterContentInit() {
    this.created();
  }


}
