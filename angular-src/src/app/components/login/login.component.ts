import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { AppSettings } from '../../settings/app.settings';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(private authService: AuthService, private notificationService: NotificationService, private router: Router, private flashMessagesSercice: FlashMessagesService) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
      console.log(data);
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        AppSettings.USER_ID = data.user.id;
        //this.flashMessagesSercice.show("You are logged in",{cssClass: 'alert-success', timeout:5000});
        this.notificationService.showNotifSuccess("You are logged in");
        this.router.navigate(['/dashboard']);
      } else {
        //this.flashMessagesSercice.show(data.msg,{cssClass: 'alert-danger', timeout:5000});
        this.notificationService.showNotifWarning(data.msg);
        this.router.navigate(['/login']);
      }
    });
  }
}
