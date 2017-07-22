import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';
import { CommentService } from '../../../services/comment.service';
import { NotificationService } from '../../../services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css']
})
export class BioComponent implements OnInit {
   @Input() childUser:User;
   @Output() userUpdated = new EventEmitter();
   comments= [];
   updateUser: boolean= false;

  constructor(private authService: AuthService, private notificationService: NotificationService, private commentService: CommentService) { }

  ngOnInit() {
    this.commentService.getCommentsUser(this.authService.getUser().id).subscribe( data => {
      
      this.comments = data.comments;
      console.log(this.comments);
    });
  }

  submitFormProfile(){
    //if(this.isValid()){
    this.updateUser = !this.updateUser;
    this.authService.updateProfile(this.childUser).subscribe( data =>{
      this.userUpdated.emit(this.childUser);
      this.notificationService.showNotifSuccess("The profile has been updated !");
    });
    //}
  }

  updateProfile(){
    this.updateUser = !this.updateUser;
  }

  isValid(){
    if(this.childUser.name && ""){
      return true;
    }else{
      return false;
    }
  }

}
