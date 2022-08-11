import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { ProfileRefreshService } from 'src/app/shared/refreshers/profile-refresh.service';
import { TokenStorageService } from 'src/app/shared/services/auth/token-storage.service';
import { PopupsServiceService } from 'src/app/shared/services/popups-service.service';
import { ProfileMenuService } from 'src/app/shared/services/profile-menu.service';
import { UserDataService } from 'src/app/shared/services/user/user-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-window',
  templateUrl: './profile-window.component.html',
  styleUrls: ['./profile-window.component.scss'],
})
export class ProfileWindowComponent implements OnInit {

  filepath = environment.filepath;
  api = environment.api;
  user: User = new User;

  constructor(
    public popupsService: PopupsServiceService,
    public profileService: ProfileMenuService,
    private http: HttpClient,
    private router: Router,
    private userdataservice: UserDataService,
    private profilerefresher: ProfileRefreshService,
    private tokenStorage: TokenStorageService,
  ) {}

  ngOnInit(): void {
    let authUser = JSON.parse(sessionStorage.getItem('auth-user')!);
    this.user = authUser.user;

    this.profilerefresher.getMessage().subscribe(res => {
      this.userdataservice.getCurrentUser(localStorage.getItem('token')+'').subscribe(data => {
        this.user = data;
      })
    })
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.popupsService.visibleProfileWindow = false;
  }


  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/home']);
    /*this.http.post(this.api+'logout', {}, {withCredentials: true}).subscribe(() => {
      this.router.navigate(['/home']);
      localStorage.removeItem('token');
    });*/
    this.popupsService.visibleProfileWindow =
      !this.popupsService.visibleProfileWindow;
  }
}
