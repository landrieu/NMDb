import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AppSettings } from './settings/app.settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private authService: AuthService){
    console.log("APP INIT");
    this.authService.getProfile().subscribe(profile => {
      AppSettings.USER_ID = profile.user._id;
    },
    err => {
      console.log(err);
      return false;
    });
  }
}
