import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(private notificationService: NotificationService, private router: Router, private validateService: ValidateService, private authService: AuthService, private flashMessages: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }
    //Validate Fields
    if (!this.validateService.validateRegister(user)) {
      this.notificationService.showNotifDanger("Fill the fields");
      return false;
    }
    //Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.notificationService.showNotifDanger("Fill the email");
      return false;
    }

    //Register user
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.notificationService.showNotifSuccess("You are now registered");
        this.router.navigate(['/login']);
      } else {
        this.notificationService.showNotifDanger("Something went wrong");
        this.router.navigate(['/register']);
      }
    });
  }
}
