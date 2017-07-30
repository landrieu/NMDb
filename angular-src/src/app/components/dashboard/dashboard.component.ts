import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { RatingModule } from "ngx-rating";
declare var jquery:any;
declare var $ :any;

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


  constructor(private movieService: MovieService, private authService: AuthService, private commentService: CommentService) {
   }

  ngOnInit() {
    this.authService.getNumberUser().subscribe( number =>{
      this.numberUsers = number;
    });
    this.movieService.getStatsMovies().subscribe(data => {
      this.moviesBestRating = data.bestRatingMovies;
      this.moviesMostRated = data.mostRatedMovies;
      this.numberMovies = data.numberMovies;
    });
    this.commentService.getStats().subscribe( data =>{
      this.numberComments = data.numberComments;
    });
    
  }

  ngAfterViewInit(){
     
  }

}
