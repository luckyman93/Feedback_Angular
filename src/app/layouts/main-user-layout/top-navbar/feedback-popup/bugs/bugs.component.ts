import { Component, OnInit, Output, EventEmitter, Input, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataCommentsService } from 'src/app/shared/services/data-comments.service';
import { PopupsServiceService } from 'src/app/shared/services/popups-service.service';
import { TokenService } from 'src/app/shared/services/auth/token.service';
import { ToastrService } from 'ngx-toastr';
import { PostType } from '../../../feedback-window/feedback-window.component';

type NotifyType = {
  feedbacks: any;
  feedbackcomments: any;
}

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss'],
})

@Injectable({
  providedIn: 'root',
})

export class BugsComponent implements OnInit {
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Input() feedbacks: PostType[] = [];

  sortType: string = 'Top';
  sortTypes: string[] = ['My Own', 'Top', 'New'];
  filterType: string = 'None';
  filterTypes: string[] = [
    'Under Review',
    'Planned',
    'In Progress',
    'Complete',
  ];
  settingTypes: string[] = ['edit','delete'];
  statusType: string = 'None';
  role: any = '';
  userId: any = '';
  seletedTitle : string = '';
  closeResult: string = '';
  clickedComment = {} as PostType | undefined;
  notifyInfo = {} as NotifyType;
  notifyInfoCount: number = 0;
  stopCheckNotify: boolean = false;
  
  

  // title = 'angulartoastr';
  showModal: boolean = false;


  constructor(
    
    public popupsService: PopupsServiceService,
    public dataCommentService: DataCommentsService,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private TokenService: TokenService,
    private toastr:ToastrService,
  ) {}

  ngOnInit(): void {

    this.role = this.TokenService.getUserRole();
    this.userId = this.TokenService.getUserId();
    this.dataCommentService.getNotify().subscribe(response => {
      if (response.result) {
        this.notifyInfo = response.data;
        this.notifyInfoCount = response.data.feedbacks.length + response.data.feedbackcomments.length;
      }
    });
  } 

  getFeedbacks() {

    let result;
    let status = this.filterTypes.indexOf(this.sortType);

    if (status !== -1) {
      result = this.feedbacks.filter((feedback)=>(feedback.status === (status+1)));
    } else {
      if (this.sortType === 'Top') {
        result = this.feedbacks.sort((a, b) => (
          b.votes.length - a.votes.length
        ));
      } else if (this.sortType === 'My Own') {
        let userId = this.TokenService.getUserId();
        result = this.feedbacks.filter((feedback) => (feedback.user_id === userId))
      } else if (this.sortType === 'New') {
          result = this.feedbacks.sort(function(a, b){
          return +new Date(b.updated_at) - +new Date(a.updated_at);
        });
      }
    }
    return result;
  }

  chooseSortType(item: string): void {
    this.sortType = item;
  }

  chooseStatusType(status: string, item: any): void {

    let statusNum = this.filterTypes.indexOf(status);

    const formData = new FormData();
    formData.append("id", item._id);
    formData.append("status", (statusNum+1).toString());
    this.dataCommentService.updateFeedback(formData).subscribe(response => {

      if( response.result ) {
        this.feedbacks = this.feedbacks.map((item) => {
          if (item._id === formData.get('id')) {
            item.status = response.data.status;
          }
          return item;
        });
        this.toastr.success('Updated the status successfully.', 'Success'); return;
      }
      this.toastr.error('Failed the feedback Updating.', 'Fail');
    });
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  onMore(settingType: string, item: any, content:any) {

    if (settingType === 'edit') {
      this.update.emit(item);
    } else {
      this.seletedTitle = item.title;
      //modal
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(
        (result) => {
        this.dataCommentService.deleteFeedback(item._id).subscribe(response => {
          if(response.result){
            this.delete.emit(item._id);
            this.toastr.success('Deleted the feedback successfully.', 'Success'); return;
          }
          this.toastr.error(response.message, 'error');
        });

        this.closeResult = `Closed with: ${result}`;
      }, 
        (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  onUpvote(id: string) {
    
    this.dataCommentService.upVote(id).subscribe(response => {
      if (response.result) {
        this.feedbacks = this.feedbacks.map((item) => {
            if (item._id === id) {
              item.votes.push(this.userId);
            }
            return item;
          });
          this.toastr.success('Voted up successfully.', 'Success'); return;
        }
        this.toastr.error(response.message, 'Fail');      
    })
  }

  onCheckInfo () {

    let notifyInfo = this.notifyInfo;
    let arrfeedbacksIds;
    let arrfeedbackCommentsIds;

    if(notifyInfo.feedbacks === undefined || notifyInfo.feedbackcomments === undefined) return;

    const formData = new FormData();
    console.log('1')

    if (notifyInfo.feedbacks.length !== 0) {
      arrfeedbacksIds = notifyInfo.feedbacks.map((feedback:any)=>(feedback._id ));
      for (var i = 0; i < arrfeedbacksIds.length; i++) { 
        formData.append("feedback_ids[]", arrfeedbacksIds[i]);
      }
    } 
    console.log('2')
    
    if (notifyInfo.feedbackcomments.length !== 0) {
      arrfeedbackCommentsIds = notifyInfo.feedbackcomments.map((feedbackcomment:any)=>(feedbackcomment._id));
      for (var i = 0; i < arrfeedbackCommentsIds.length; i++) { 
        formData.append("feedbackcomment_ids[]", arrfeedbackCommentsIds[i]);
      }
    } 

    if (!this.stopCheckNotify && this.notifyInfoCount !== 0) {
      console.log('3')
      this.dataCommentService.checkNotify(formData).subscribe(response => {
        if (response.result) {
          this.notifyInfoCount = 0;
          this.stopCheckNotify = true;
        }
      });
    }   
  }

  openSubcomments(id : string) {
    
    this.clickedComment = this.feedbacks.find((p) => p._id === id);
    this.clickedComment?.feedback_comments.sort(function(a: any, b: any){
      return +new Date(b.updated_at) - +new Date(a.updated_at)
    });
    this.dataCommentService.allCommentsVisible = false;
  }

  returnToAllComments(): void {

    this.dataCommentService.allCommentsVisible = true;
  }
}
