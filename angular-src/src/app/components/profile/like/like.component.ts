import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef,  } from '@angular/core';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
declare var google: any;
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit, AfterViewInit {
  @Input () likeUser;

  constructor(private authService: AuthService) { }
  ngAfterViewInit(){


  }
  
  ngOnInit() {
    console.log(this.likeUser);
    
  }

  deleteLikedMovie(id){
    console.log(id);
    for(let i = 0; i < this.likeUser.likedMovies.length; i++){
      if(this.likeUser.likedMovies[i].id === id){
        this.likeUser.likedMovies.splice(i, 1);
      }
    }
    console.log(this.likeUser);
    this.authService.updateFullProfile(this.likeUser).subscribe( data => {
      console.log(data);
      
    })
    
  }

}