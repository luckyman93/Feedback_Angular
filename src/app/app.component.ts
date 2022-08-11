import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Spinkit } from 'ng-http-loader';
import { Subscription } from 'rxjs';
import { TokenStorageService } from './shared/services/auth/token-storage.service';
import { EventBusService } from './shared/services/auth/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular';

  public spinkit = Spinkit;

  api = environment.api;
  eventBusSub?: Subscription;
  isLoggedIn = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
    }
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }
  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }
  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
  }
}
