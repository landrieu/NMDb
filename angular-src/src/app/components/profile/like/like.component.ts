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
    
  }

}