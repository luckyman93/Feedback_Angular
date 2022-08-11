import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { TokenStorageService } from 'src/app/shared/services/auth/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sheet-model',
  templateUrl: './sheet-model.component.html',
  styleUrls: ['./sheet-model.component.scss']
})
export class SheetModelComponent implements OnInit, AfterViewInit {
  @ViewChild('spreadsheet')
  public spreadsheetObj!: SpreadsheetComponent;

  fileSavePath = environment.filepath;

  selectedFile: any;
  updatedFile: any;

  created () {
    fetch("http://127.0.0.1:8000/excels/ValuationModelEndeavour.xlsx") // fetch the remote url
      .then((response) => {
        response.blob().then((fileBlob) => { // convert the excel file to blob
        this.updatedFile = new File([fileBlob], "Sample.xlsx"); //convert the blob into file
        this.spreadsheetObj.open({ file: this.updatedFile }); // open the file into Spreadsheet



        setTimeout(() => {
          this.spreadsheetObj.freezePanes(1,1)
          this.spreadsheetObj.showFormulaBar = false;
          this.spreadsheetObj.showRibbon = false;
          this.spreadsheetObj.showSheetTabs = false;
          this.spreadsheetObj.enableContextMenu = false;
          this.selectedFile = this.spreadsheetObj.sheets;
          this.spreadsheetObj.sheets.forEach(el => {
            el.showHeaders = false;

            el.rows?.forEach((r: any) => {
              r.cells[0].isLocked = false
              //r.cellFormat({backgroundColor: '#ff3333'}, r.cells[0].value < 0)
            })
          });
        }, 5000);

        })
      })
  }

  @Input() row: any;

  constructor(
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.created();
  }

  consoleSheet() {
    this.selectedFile = this.spreadsheetObj.sheets;
    console.log(this.selectedFile);
  }

  beforeSave(e: any) {

  }

}
