import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: User;
  childTitle = "test";
  userName: String;
  backgroundImagePath = "/assets/images/GR1.JPG";
  private sub: any;
  isMyProfile: boolean;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private flashMessagesSercice: FlashMessagesService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let idUser = params['id'];
      console.log(idUser);
      if (idUser !== undefined) {
        this.isMyProfile = false;
        this.authService.getUserById(idUser).subscribe(data => {
          console.log(data);
          this.user = data;
          this.userName = data.name;
        });
      } else {
        this.isMyProfile = true;
        this.authService.getProfile().subscribe(profile => {
          this.user = profile.user;
          this.userName = profile.user.name;
        },
          err => {
            console.log(err);
            return false;
          });
      }
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


  ngAfterViewInit() {
    $(".btn-pref .btn").click(function () {
      $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
      // $(".tab").addClass("active"); // instead of this do the below 
      $(this).removeClass("btn-default").addClass("btn-primary");
    });


  }

}
