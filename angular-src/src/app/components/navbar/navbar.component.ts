import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NotificationService } from '../../services/notification.service'
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService,private notificationService: NotificationService, private router: Router, private flashMessagesSercice: FlashMessagesService) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.authService.logout();
    //this.flashMessagesSercice.show("You are logged out", {cssClass: 'alert-success', timeout: 3000});
    this.notificationService.showNotifSuccess("You are logged out");
    this.router.navigate(['/login']);
    return false;
  }
  ngAfterViewInit(){
    $('.notification').hide();
    $('.notification').click(function(){
      $('.notification').hide();
    });
  }
 
}
