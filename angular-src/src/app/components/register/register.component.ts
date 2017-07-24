import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
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

  constructor(private router: Router, private validateService: ValidateService, private authService: AuthService, private flashMessages: FlashMessagesService) { }

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
      this.flashMessages.show("no00", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }
    //Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessages.show("Fill the email", { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    //Register user
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessages.show("You are now registered", { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessages.show("Something went wrong", { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/register']);
      }
    });
  }
}
