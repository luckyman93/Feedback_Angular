import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/User';
import { SheetService } from 'src/app/shared/refreshers/sheet.service';
import { ThemeService } from 'src/app/shared/refreshers/theme.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import { UserDataService } from 'src/app/shared/services/user/user-data.service';
import { UserSelectService } from 'src/app/shared/services/user/user-select.service';


import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnInit, AfterViewInit {
  @ViewChild('spreadsheet')
  public spreadsheetObj!: SpreadsheetComponent;
  created () {
    let filename = this.selectedFile;
    fetch(this.url) // fetch the remote url
      .then((response) => {
        response.blob().then((fileBlob) => { // convert the excel file to blob
        let file = new File([fileBlob], "Sample.xlsx"); //convert the blob into file
        this.spreadsheetObj.open({ file: file }); // open the file into Spreadsheet
        setTimeout(() => {
          console.log('+++++',this.spreadsheetObj.sheets);
          this.spreadsheetObj.freezePanes(1,1)
          this.spreadsheetObj.showFormulaBar = false;
          this.spreadsheetObj.showRibbon = false;
          this.spreadsheetObj.showSheetTabs = false;
          this.spreadsheetObj.enableContextMenu = false;

          this.spreadsheetObj.sheets.forEach(el => {
            el.showHeaders = false;

            /*el.rows?.forEach((r: any) => {
              r.cells[0].isLocked = false
              //r.cellFormat({backgroundColor: '#ff3333'}, r.cells[0].value < 0)
            })*/
          });
        }, 5000);

        })
      })
  }


  @Input() row: any;

  exceltoJson: any = {};

  token: string = '';
  user: User = new User();
  selectedTabId: string = '';

  company: any;
  init: boolean = true;

  saveInitSheetForm!: FormGroup;
  mainSheetForm!: FormGroup;
  displaySheetNameModal!: boolean;

  files: any[] = [];
  position: string = '';

  selectedLightTheme: any = 'atom-theme';
  selectedDarkTheme: any = 'atom-theme';
  selectedThemeMode: any = 'light';

  selectedFile: string = '';

  url: any;

  constructor(
    private fileservice: FileService,
    private userdata: UserDataService,
    private userSelect: UserSelectService,
    private fb: FormBuilder,
    private sheetRefresher: SheetService,
    private themeRefresher: ThemeService,
    private http: HttpClient
  ) {

    this.saveInitSheetForm = this.fb.group({
      user_id: [''],
      tab_id: [''],
      company_id: [''],
      file_name: [''],
      init_file: ['']
    });
    this.mainSheetForm = this.fb.group({
      user_id: [''],
      tab_id: [''],
      company_id: [''],
      file_name: ['', Validators.required],
      init_file: ['']
    });
  }

  ngAfterViewInit(): void {
    this.token = localStorage.getItem('token')+'';
    this.userdata.getCurrentUser(this.token).subscribe((data) => {
      this.user = data;
      //console.log(this.user._id)
      this.fileservice.SelectUserCompanySheets(sessionStorage.getItem('user_id')+'', this.row.company_id).subscribe(res => {
        if(res.length == 0) {
          //select the main sheet of the selected company
          this.userSelect.getCompanyDetails(this.row.company_id).subscribe(res => {
            //console.log(res);
            this.init = true;
            this.company = res[0];
            this.saveInitSheetForm.value.user_id = this.user._id;
            this.saveInitSheetForm.value.company_id = this.row.company_id;
            this.saveInitSheetForm.value.tab_id = this.selectedTabId;

            this.saveInitSheetForm.value.file_name = 'initial_'+this.company.name+'_Sheet';
            this.saveInitSheetForm.value.init_file = this.company.excel;
          })
          //console.log('iniiiit');
        } else {
          this.files = res;

          console.log(this.files);

          this.selectedFile = this.files[0].file_name;
          this.url = "http://127.0.0.1:8000/excels/"+this.selectedFile.toString()+".xlsx"

          console.log('*******************',this.url)
          this.created();

          this.init = false;
          this.userSelect.getCompanyDetails(this.row.company_id).subscribe(res => {
            this.company = res[0];
          });
        }
      });
    });

    this.sheetRefresher.getMessage().subscribe(refresh => {
      this.fileservice.SelectUserCompanySheets(this.user._id, this.row.company_id).subscribe(res => {
        this.files = res;
      });
    });
  }

  ngOnInit(): void {

    //get the File path from Laravel $storagePath  = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix()



    this.selectedTabId = localStorage.getItem('selected_Tab')+'';




    //Select the Files version of specific company SelectUserCompanySheets(user_id, company_id)
    //select Sheets where user_id && tab_id && company_id (company_id came from the row data:
    // ==> should update the splittedArea with the selected company_id)
  }

  OpenFileNameModal(position: string) {
    this.position = position;
    this.displaySheetNameModal = true;
  }

  saveInitFile() {
    if(this.init) {
      this.fileservice.saveInitUserSheet(this.saveInitSheetForm.value).subscribe(res => {
        console.log(res);
      });
    } else {
      //this.displaySheetNameModal = true;
      this.mainSheetForm.value.user_id = this.user._id;
      this.mainSheetForm.value.company_id = this.row.company_id;
      this.mainSheetForm.value.tab_id = this.selectedTabId;
      this.mainSheetForm.value.init_file = this.company.excel;
      this.fileservice.saveInitUserSheet(this.mainSheetForm.value).subscribe(res => {
        console.log(res);
        this.sheetRefresher.setMessage('sheet copied!');
        this.mainSheetForm.reset()
        //this.displaySheetNameModal = true;
      });
    }
  }


  deleteSheetVersion(id: string) {
    this.fileservice.deleteSheetVersion(id).subscribe(res => {
      console.log(res);
      this.sheetRefresher.setMessage('sheet deleted');
    })
  }

  updateFileName(name: string, id: string) {
    this.fileservice.updateFileName(name, id).subscribe(res => {
      console.log(res);
      this.sheetRefresher.setMessage('sheet name updated');
    })

  }

  /* READ EXCEL FILE AND CONSOLE ITS DATA IN THE CLIENT SIDE */


}
