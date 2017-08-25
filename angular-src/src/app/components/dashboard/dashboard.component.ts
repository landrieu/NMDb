import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user';
import { RatingModule } from "ngx-rating";
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  numberUsers: number = 0;
  numberMovies: number = 0;
  numberComments: number = 0;
  moviesMostRated: Movie[];
  moviesBestRating: Movie[];
  users: User[];
  user: User;


  constructor(private router: Router, private movieService: MovieService, private authService: AuthService, private commentService: CommentService) {
  }

  ngOnInit() {
    // Get Stats about users, movies and comments

    // Get the number of users from the Db 
    this.authService.getNumberUser().subscribe(number => {
      this.numberUsers = number;
    });

    // Get stats about movies from Db
    this.movieService.getStatsMovies().subscribe(data => {
      this.moviesBestRating = data.bestRatingMovies;
      this.moviesMostRated = data.mostRatedMovies;
      this.numberMovies = data.numberMovies;
    });

    // Get the number of comments posted from the Db 
    this.commentService.getStats().subscribe(data => {
      this.numberComments = data.numberComments;
    });

      this.authService.getUsers().subscribe(data => {
        this.users = data.users;

        this.users.sort(function (a, b) {
          let c = +new Date(a.lastConnection);
          let d = +new Date(b.lastConnection);
          return d - c;
        });
      });
    
    this.authService.getProfile().subscribe(data => {
            this.user = data.user;
    });
  }

  showUser(id){    
    if (id === this.user._id) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile/' + id]);
    }
  }

  ngAfterViewInit() {

  }

}
