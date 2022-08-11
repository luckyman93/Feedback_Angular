import { Component, OnInit, Input, Injectable, Output, EventEmitter } from '@angular/core';
import { DataCommentsService } from 'src/app/shared/services/data-comments.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-updateform',
  templateUrl: './updateform.component.html',
  styleUrls: ['./updateform.component.scss'],
})

@Injectable({
  providedIn: 'root',
})

export class UpdateFormComponent implements OnInit {
  @Output() updateComment = new EventEmitter<any>();
  @Output() updateSubComment = new EventEmitter<any>();

  @Input() targetId = 'none';
  @Input() uniqueId = 'none';
  @Input() comment = '';
  @Input() type = 'none';

  visibleDropdownField: boolean = false;
  emptyCommentContent: boolean = false;
  safehtmlComment: SafeHtml = '';
  inputedCommentLetterNum: string = '';
  errorLetter: string = '';

  //image upload
  myFileName : any = [];
  myFiles:string [] = [];
  myFilesPreview:string [] = [];
  errImageSize: boolean = false;


  constructor(
    public dataCommentService: DataCommentsService,
    public dom:DomSanitizer,
    private toastr: ToastrService
    ) {
    this.safehtmlComment=dom.bypassSecurityTrustHtml(this.inputedCommentLetterNum);
  }

  ngOnInit(): void {

  }

  onSelectFile(event:any):void {

    this.errImageSize = false;

    for (var i = 0; i < event.target.files.length; i++) {

      if (event.target.files[i].size > 1000000) {
        this.errImageSize = true;
        return;
      }

      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.myFilesPreview.push(event.target.result);
      };
      reader.readAsDataURL(event.target.files[i]);

      this.myFileName.push(event.target.files[i].name);
      this.myFiles.push(event.target.files[i]);
    }
  }

  onImageDelete(index: number) {
    this.myFilesPreview.splice(index, 1);
    this.myFiles.splice(index, 1);
    this.myFileName.splice(index, 1);
  }

  onCommentContentChange(e: any) {

    let commentLength = e.target.value.length;

    if (commentLength > 0) {
      this.comment = e.target.value;
      this.inputedCommentLetterNum = "The number of characters you entered is <span style = 'color: white'>" + commentLength + "</span>/<span style = 'color:red'>1000</span> characters.";
      this.emptyCommentContent = false;
    } else {
      this.comment = '';
      this.inputedCommentLetterNum = '';
    }
    this.safehtmlComment=this.dom.bypassSecurityTrustHtml(this.inputedCommentLetterNum);
  }

  onUpdateComment(): void {

    //validation
    if(this.comment.length === 0){
      this.emptyCommentContent = true;
      this.errorLetter = '*Required Content';
      return;
    } else if( this.comment.length > 1000 ) {
      this.emptyCommentContent = true;
      this.errorLetter = 'Content is no longer than 1000 character';
      return;
    }

    //formData
    const formData = new FormData();
    formData.append("id", this.targetId);

    if (this.myFiles.length !== 0) {

      for (var i = 0; i < this.myFiles.length; i++) {
        formData.append("file[]", this.myFiles[i]);
      }
    }

    //update comment or sub-comment sub-comment
    if (this.type === 'updateComment') {

      formData.append("comment", this.comment);
      this.dataCommentService.updateComment(formData).subscribe(response => {
        if (response.result) {
          this.updateComment.emit({data: response.data, id: this.targetId});
          this.onVariableinitialize();
          this.toastr.success('Updated the comment successfully.', 'Success'); return;
        }
        this.toastr.error('Failed Comment update.', 'Fail');
      });
    } else {

      formData.append("content", this.comment);
      this.dataCommentService.updateSubComment(formData).subscribe(response => {
        if (response.result) {
          this.updateSubComment.emit({data: response.data, id: this.targetId});
          this.onVariableinitialize();
          this.toastr.success('Updated the sub-comment successfully.', 'Success'); return;
        }
        this.toastr.error('Failed sub-comment update.', 'Fail');
      })
    }
  }

  onVariableinitialize(): void {
    this.comment = '';
    this.inputedCommentLetterNum = '';
    this.myFileName = [];
    this.myFilesPreview = [];
    this.visibleDropdownField = false;
    this.safehtmlComment=this.dom.bypassSecurityTrustHtml(this.inputedCommentLetterNum);
  }

  showDropdownField(): void {
    this.visibleDropdownField = true;
  }

  hideDropdownField(): void {
    if(this.comment.length === 0) {
      // this.visibleDropdownField = false;
    }
  }

}
