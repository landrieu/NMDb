import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  numberUsers: number = 0;

  constructor(private authService: AuthService) {
   }

  ngOnInit() {
    this.authService.getNumberUser().subscribe( number =>{
      this.numberUsers = number;
    });

  }

  ngAfterViewInit(){
     
  }

}
