import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataCommentsService } from 'src/app/shared/services/data-comments.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/auth/token.service';
import { BugsComponent } from 'src/app/layouts/main-user-layout/top-navbar/feedback-popup/bugs/bugs.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})

export class CommentComponent implements OnInit {
  @Input() clickedComment = {} as any;

  filepath = environment.filepath+'uploads/files/';

  activeSortSubcommentBtn: string = 'newest';
  viewComCreateOrUpdateForm: boolean = false;
  viewSubCreateOrUpdateForm: boolean = false;
  viewFullLetter: boolean = false;
  closeResult: string = '';
  username: string = '';
  userId:any = '';
  role:any = '';

  images: any[] = [];

  constructor(
    public dataCommentService: DataCommentsService,
    public route: ActivatedRoute,
    private TokenService: TokenService,
    private modalService: NgbModal,
    public bugCom: BugsComponent,
    private toastr: ToastrService
    ) {}

  statusTypes: string[] = [
    'Under Review',
    'Planned',
    'In Progress',
    'Complete',
  ];

  ngOnInit(): void {
    this.userId = this.TokenService.getUserId();
    this.role = this.TokenService.getUserRole();
  }

  onViewFullLetter(): void {
    this.viewFullLetter = true;
  }

  onViewSummaryLetter(): void {
    this.viewFullLetter = false;
  }

  chooseSubcommentSort(str: string) {

    if (str === 'newest') {
      this.clickedComment.feedback_comments.sort(function(a: any, b: any){
        return +new Date(b.updated_at) - +new Date(a.updated_at)
      });
    } else {
      this.clickedComment.feedback_comments.sort(function(a: any, b: any){
        return +new Date(a.updated_at) - +new Date(b.updated_at)
      });
    }
    this.activeSortSubcommentBtn = str;
  }

  onViewForm (id: string, formtype:string) {

    let createform = document.getElementById(id+'1');
    let updateform = document.getElementById(id+'2')
    if ( formtype === 'updateComForm' ) {
      createform!.style.display = 'none';
      updateform!.style.display === 'none'
       ? updateform!.style.display = 'block'
       : updateform!.style.display = 'none';
    } else {
      updateform!.style.display = 'none';
      createform!.style.display === 'none'
      ? createform!.style.display = 'block'
      : createform!.style.display = 'none';
    }
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

  onDeleteFeedbackComment(content: any, id: string, name: string) {

    this.username = name;
    //modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //delete comment to dataCommentService
      this.dataCommentService.deleteFeedbackComment(id).subscribe(response => {
        if(response.result) {
          this.clickedComment.feedback_comments = this.clickedComment.feedback_comments.filter((item:any) => (
            item._id !== id
          ));
          this.toastr.success('Deleted the FeedbackComment successfully.', 'Success'); return;
        }
        this.toastr.error(response.message, 'error');
      });

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onDeleteFeedbackSubComment(content: any, id: string, name: string) {

    this.username = name;
    //modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //delete subcomment to dataCommentService
      this.dataCommentService.deleteFeedbackSubComment(id).subscribe(response => {
        if(response.result) {
          this.clickedComment.feedback_comments = this.clickedComment.feedback_comments.map((item:any) => {
            item.sub_comments = item.sub_comments.filter((item:any) => (
              item._id !== id
            ))
            return item;
          })
          this.toastr.success('Deleted the FeedbackSubComment successfully.', 'Success'); return;
        }
        this.toastr.error(response.message, 'error');
      });

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onPopUpImage(id: string) {

    let PopUpImageModal = document.getElementById("myModal");
    let ImgId = document.getElementById(id);
    let modalImg = document.getElementById("img01");
    PopUpImageModal!.style.display = "block";
    (modalImg as HTMLImageElement).src = (ImgId as HTMLImageElement).src;
  }

  onCloseImage() {

    let PopUpImageModal = document.getElementById("myModal");
    PopUpImageModal!.style.display = "none";
  }

  onCreateComment(comment: any) {

    this.clickedComment.comments.push(comment._id);
    this.clickedComment.feedback_comments.splice(0, 0, comment);
  }

  onCreateSubComment(subComment: any) {

    this.clickedComment.feedback_comments.map((item:any,i:number) => {
      if (item._id === subComment.id) {
        item.sub_comments.push(subComment.data);
      }
    });
  }

  onUpdateComment(comment: any) {

    this.clickedComment.feedback_comments = this.clickedComment.feedback_comments.map((item:any) => {
      if (item._id === comment.id) {
        item.comment = comment.data.comment;
        item.updated_at = comment.data.updated_at;
        item.file = comment.data.file;
      }
      return item;
    });
  }

  onUpdateSubComment(subComment: any) {

    this.clickedComment.feedback_comments = this.clickedComment.feedback_comments.map((item:any) => {
    item.sub_comments.map((item: any) => {
        if (item._id === subComment.id) {
          item.content = subComment.data.content;
          item.updated_at = subComment.data.updated_at;
          item.file = subComment.data.file;
        }
        return item;
      })
      return item;
    });
  }
}
