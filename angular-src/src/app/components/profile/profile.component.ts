import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: User;
  childTitle= "test";
  userName: String;
  backgroundImagePath = "/assets/locale/images/GR1.JPG";
  constructor(private authService: AuthService, private router: Router, private flashMessagesSercice: FlashMessagesService) {

  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.userName = profile.user.name;
      console.log(profile.user);
    },
    err => {
      console.log(err);
      return false;
    });
  }

  handleUserUpdated(user) {
    // Handle the event
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.userName = profile.user.name;
      console.log(profile.user);
    },
    err => {
      console.log(err);
      return false;
    });
    console.log("UPD");
  }
  ngAfterViewInit(){
    $(".btn-pref .btn").click(function () {
        $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
        // $(".tab").addClass("active"); // instead of this do the below 
        $(this).removeClass("btn-default").addClass("btn-primary");   
    });
    
    
  }

}
