import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ProfileRefreshService } from 'src/app/shared/refreshers/profile-refresh.service';
import { UserAccountService } from 'src/app/shared/services/user/user-account.service';
import { UserDataService } from 'src/app/shared/services/user/user-data.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})
export class PublicProfileComponent implements OnInit {
  user: User = new User;
  folepath = environment.filepath;
  selectedFile!: File;

  displayNameForm = {
    id: '',
    displayName: ''
  }

  constructor(
    private userdataservice: UserDataService,
    private http: HttpClient,
    private profilerefresher: ProfileRefreshService,
    private useraccountservice: UserAccountService,
  ) {}

    ngOnInit(): void {

      this.http.post(environment.api+'me', httpOptions).subscribe(res => {
        console.log('======HHHHHHH==========', res);
      })

      let user_id = sessionStorage.getItem('user_id')!;

      this.userdataservice.getCurrentUser(user_id).subscribe(res => {
        this.user = res;
        console.log('RRRRRRRRRRRRRR', this.user);
      })

      if(this.user) {
        this.displayNameForm.displayName = this.user.displayName;
        this.displayNameForm.id = this.user._id;
      }

      this.profilerefresher.getMessage().subscribe(res => {
        this.userdataservice.getCurrentUser(user_id).subscribe(data => {
          this.user = data;
        })
      })
    }

    onFileSelected(event: any) {
      this.selectedFile = <File>event.target.files[0];

      const fd = new FormData();
      fd.append('id', this.user._id);
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.http.post(environment.api+'profileAvatarUpload', fd).subscribe(res => {
        console.log(res);
        this.profilerefresher.setMessage("new operation");
      });
    }

    updateUser() {
      this.useraccountservice.updateDisplayName(this.displayNameForm).subscribe(res => {
        console.log(res);
        this.profilerefresher.setMessage("new operation");
      });
    }
}
