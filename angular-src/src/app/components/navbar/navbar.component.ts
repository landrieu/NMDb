import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private locationService: LocationService, private authService: AuthService, private notificationService: NotificationService, private router: Router) {
  
  }

  ngOnInit() {

  }

  isLogged(){
    return this.authService.loggedIn();
  }

  /*
   *  Logout and redirect to the login page
   */
  onLogoutClick() {
    this.authService.logout();
    this.notificationService.showNotifSuccess("You are logged out");
    this.router.navigate(['/login']);
    return false;
  }
  ngAfterViewInit() {
    $('.notification').hide();
    $('.notification').click(function () {
      $('.notification').hide();
    });
  }

  ngOnDestroy() {

  }

}
