import { Component, HostListener, OnInit } from '@angular/core';
import { DataCommentsService } from 'src/app/shared/services/data-comments.service';
import { PopupsServiceService } from 'src/app/shared/services/popups-service.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

export type PostType = {
  _id: string;
  title: string;
  details: string;
  category: number;
  comments: any;
  votes: any[];
  user_id: string;
  status: number;
  notify: number;
  file: string[];
  updated_at: string;
  created_at: string;
  user_name: string;
  user_role: number;
  user_avatar: any;
  feedback_comments: CommentType[];
}

type CommentType = {
  _id: string;
  comment: string;
  user_id: string;
  feedback_id: string;
  notify: number;
  file: any;
  updated_at: string;
  created_at: string;
  user_name: string;
  user_role: number;
  user_avatar: any;
  sub_comments: any;
};

@Component({
  selector: 'app-feedback-window',
  templateUrl: './feedback-window.component.html',
  styleUrls: ['./feedback-window.component.scss'],
})

export class FeedbackWindowComponent implements OnInit {

  constructor(
    public popupsService: PopupsServiceService,
    public dataCommentService: DataCommentsService,
    private toastr:ToastrService,
    public dom:DomSanitizer
  ) {
    this.safehtmlTitle=dom.bypassSecurityTrustHtml(this.inputedTitleLetterNum);
    this.safehtmlContent=dom.bypassSecurityTrustHtml(this.inputedContentLetterNum);
  }

  feedbacks: PostType[] = [];

  postTitle : string = '';
  postContent : string = '';
  errTitleLetter : string = '';
  errContentLetter : string = '';
  inputedTitleLetterNum : string = '';
  inputedContentLetterNum : string = '';
  safehtmlTitle:SafeHtml;
  safehtmlContent:SafeHtml;
  catetgory : number = 1;
  noLongerTite = false;
  noLongerContent = false;
  errPostTitle = false;
  errPostContent = false;
  errImageSize = false;
  submitType = 'create';
  postId: string = '';

  myFileName : any = [];
  myFiles:string [] = [];
  myFilesPreview:string [] =[];



  

  ngOnInit(): void {

    this.dataCommentService.loadFeedbacks(this.catetgory).subscribe(response => {
      if (response.result) {
        this.feedbacks = response.data; return;
      }
      this.toastr.error('Failed Loading Post', 'Fail'); return; 
    });
  }

  openFeedbackTab(tibTitle : string): void {

    if (tibTitle === 'bugs & errors') {
      this.catetgory = 1;
    }

    if (tibTitle === 'feature requests') {
      this.catetgory = 2;
    }

    if (tibTitle === 'questions') {
      this.catetgory = 3;
    }

    this.popupsService.openFeedbackTab(tibTitle);

    // get feedback by category
    this.dataCommentService.loadFeedbacks(this.catetgory).subscribe(response => {
      if (response.result) {
        this.feedbacks = response.data; return;
      }
      this.toastr.error('Failed Loading Post', 'Fail'); return; 
    });
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.popupsService.visibleFeedbackWindow = false;
  }

  onPostTitleChange(e: any) {

    let titleLength = e.target.value.length;

    if (0 < titleLength) {
      this.inputedTitleLetterNum = "The number of characters you entered is <span style = 'color: white'>" + titleLength + "</span>/<span style = 'color:red'> 100 </span> characters.";
      if (titleLength < 100) {
        this.errPostTitle = false;
      }
    } else {
      this.inputedTitleLetterNum = '';
    }
    this.safehtmlTitle=this.dom.bypassSecurityTrustHtml(this.inputedTitleLetterNum);

  }

  onPostContentChange(e: any) {

    let contentLength = e.target.value.length;

    if (0 < contentLength){
      this.inputedContentLetterNum = "The number of characters you entered is <span style = 'color: white'>" + contentLength + "</span>/<span style = 'color: red'>2500</span> characters.";
      if (contentLength < 2500) {
        this.errPostContent = false;
      }
    } else {
      this.inputedContentLetterNum = '';
    }
    this.safehtmlContent=this.dom.bypassSecurityTrustHtml(this.inputedContentLetterNum);
  }

  isValidForm() {

    if ( this.postTitle.length === 0 && this.postContent.length === 0 ){
      this.errTitleLetter = "*Required Title";
      this.errContentLetter = "*Required Details";
      this.errPostTitle = true;
      this.errPostContent = true;
      return false;
    }else if ( this.postTitle.length === 0 ){
      this.errTitleLetter = "*Required Title";
      this.errPostTitle = true;
      return false;
    }else if ( this.postContent.length === 0 ){
      this.errContentLetter = "*Required Details";
      this.errPostContent = true;
      return false;
    }else if ( this.postTitle.length > 100 && this.postContent.length > 2500 ){
      this.errTitleLetter = "Title is no longer than 100 character.";
      this.errContentLetter = "Details is no longer than 2500 character.";
      this.errPostTitle = true;
      this.errPostContent = true;
      return false;
    }else if ( this.postTitle.length > 100 ){
      this.errTitleLetter = "Title is no longer than 100 character.";
      this.errPostTitle = true;
      return false;
    }else if ( this.postContent.length > 2500 ){
      this.errContentLetter = "Details is no longer than 2500 character.";
      this.errPostContent = true;
      return false;
    }
    return true;
  }

  onFileChange(event: any) {
    
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

  onImageDelete(index:number) {
    
    this.myFilesPreview.splice(index, 1);
    this.myFiles.splice(index, 1);
    this.myFileName.splice(index, 1);
  }

  onSubmitPost() {

    if (!this.isValidForm()) {
      return;
    }
    const formData = new FormData();
    formData.append("title", this.postTitle);
    formData.append("details", this.postContent);
    formData.append("category", this.catetgory.toString());

    if (this.myFiles.length !== 0) {
      for (var i = 0; i < this.myFiles.length; i++) { 
        formData.append("file[]", this.myFiles[i]);
      }      
    }

    if (this.submitType === 'create') {

      this.dataCommentService.createFeedback(formData).subscribe(response => {
        if (response.result) {
        
          this.feedbacks.splice(0, 0, response.data);
          this.toastr.success('Created post successfully.', 'Success');
          this.onVariableinitialize();
          return;
        }
        this.toastr.error(response.message, 'Fail'); return; 
      });

    } else {

      formData.append("id", this.postId);
      this.dataCommentService.updateFeedback(formData).subscribe(response => {

        if (response.result) {

          this.feedbacks = this.feedbacks.map((item) => {
            if (item._id === formData.get('id')) {
              item.title = response.data.title;
              item.details = response.data.details;
              item.file = response.data.file;
            }
            return item;
          });
          this.submitType = 'create';
          this.onVariableinitialize();
          this.toastr.success('Updated the feedback successfully.', 'Success'); return;
        }
        this.toastr.error('Failed the feedback Updating.', 'Fail');
      });
    }
  }

  onVariableinitialize() {

    this.postTitle = '';
    this.postContent = '';
    this.inputedTitleLetterNum = '';
    this.inputedContentLetterNum = '';
    this.safehtmlTitle=this.dom.bypassSecurityTrustHtml(this.inputedTitleLetterNum);
    this.safehtmlContent=this.dom.bypassSecurityTrustHtml(this.inputedContentLetterNum);
    this.myFileName = [];
    this.myFiles = [];
    this.myFilesPreview = [];
  }

  onUpdate(feedback: any) {

    this.submitType = 'update';
    this.postTitle = feedback.title;
    this.postContent = feedback.details;
    this.postId = feedback._id;
  }

  onDelete(id: string) {
    
    this.feedbacks = this.feedbacks.filter((item) => (
      item._id !== id
    ))
  }
}
