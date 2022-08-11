import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from './auth/token.service';

@Injectable({
  providedIn: 'root',
})

export class DataCommentsService {
  private api = environment.api;
  allCommentsVisible:boolean = true;

  constructor(
    private http: HttpClient,
    private token:TokenService,
  ) {}

  loadFeedbacks(category: number): Observable<any> {
    const params = new HttpParams().set('category', category);
    return this.http.get<any>(this.api+'GetAllFeedback', {params});
  }

  createFeedback(formData: FormData): Observable<any> {
    console.log('create');
    return this.http.post<any>(this.api+'CreateFeedback', formData);
  }

  updateFeedback(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'UpdateFeedback', formData);
  }

  deleteFeedback(itemId: string): Observable<any> {
    return this.http.delete<any>(this.api + 'DeleteFeedback', {body: {feedback_id: itemId}});
  }

  upVote(itemId: string): Observable<any> {
    return this.http.post<any>(this.api + 'UpdateFeedbackVotes', {feedback_id : itemId});
  }

  createComment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'CreateFeedbackComment', formData);
  }

  createSubComment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'CreateSubComment', formData);
  }

  updateComment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'UpdateFeedbackComment', formData);  
  }

  updateSubComment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'UpdateSubComment', formData);
  }

  deleteFeedbackComment (commentId: string): Observable<any> {
    return this.http.delete<any>(this.api + 'DeleteFeedbackComment', {body: {comment_id: commentId}});
  }

  deleteFeedbackSubComment (subcommentId: string): Observable<any> {
    return this.http.delete<any>(this.api + 'DeleteSubComment', {body: {subcomment_id: subcommentId}});
  }

  getNotify(): Observable<any> {
    return this.http.post<any>(this.api + 'GetNotify', {'user_id' : this.token.getUserId()});
  }

  checkNotify(formatDate: FormData): Observable<any> {
    return this.http.post<any>(this.api + 'CheckNotify', formatDate);
  }
}
