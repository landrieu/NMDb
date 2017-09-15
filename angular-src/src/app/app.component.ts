import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AppSettings } from './settings/app.settings';
import { LocationService } from './services/location.service';
import { IpService } from './services/ip.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  constructor(private authService: AuthService, private locationService: LocationService, private ipService: IpService) {
    console.log("APP INIT");
    this.ipService.postIP().subscribe(data => {
      if (data.success === true) {
        console.log(data);
      }
    });
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe(profile => {
        AppSettings.USER_ID = profile.user._id;
      },
        err => {
          console.log(err);
          return false;
        });
    }
  }
}
