import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';
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
  comments: Comment[];
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

    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
    });

    this.authService.getUsers().subscribe(data => {
      this.users = data.users;

      this.users.sort(function (a, b) {
        let c = +new Date(a.lastConnection);
        let d = +new Date(b.lastConnection);
        return d - c;
      });

      this.commentService.getAllComments().subscribe(data => {

        this.comments = data.comments;
        
        for(let i = 0; i < this.users.length; i++){
          this.users[i].nbComments = 0;
          for(let j = 0; j < this.comments.length; j++){
            
            if(this.comments[j].idUser === this.users[i]._id){
              this.users[i].nbComments = this.users[i].nbComments + 1;
            }
          }
        }
      });
    });
  }

  showUser(id) {
    if (id === this.user._id) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile/' + id]);
    }
  }

  ngAfterViewInit() {

  }

}
