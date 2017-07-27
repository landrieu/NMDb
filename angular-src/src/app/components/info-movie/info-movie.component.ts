import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { CommentService } from '../../services/comment.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/Movie';
import { RatingModule } from "ngx-rating";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
declare var $: any;


@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.css']
})
export class InfoMovieComponent implements OnInit {
  id: String;
  private sub: any;
  movie;
  movieFromDb: Movie;
  imdbMovie: boolean = false;
  textComment;
  titleComment;
  User;
  comments = [];
  percent = 0;
  starsCount: number;

  constructor(private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService, private commentService: CommentService) { }

  ngOnInit() {
    this.notificationService.initProgressBar();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.percent = 10;
      this.notificationService.changeTextProgress(10);

      this.movieService.getMovieById(this.id).subscribe(data => {
        this.movieFromDb = data.movie;
        if (data.movie.imdbId === null || data.movie.imdbId === "" || data.movie.imdbId === undefined) {
          this.movie = data.movie;
          console.log(this.movie);
          this.getComments();
          return true;
        } else {
          console.log(this.movieFromDb);
          //let a = data.movie.rating;
          //this.movie.NbVotes = data.movie.nbVotes;

          let id = data.movie.imdbId;
          // GET movie from OMDb
          this.movieService.getMovieIMDbByIdBack(id).subscribe(movie => {
            this.percent = 60;
            this.notificationService.changeTextProgress(60);

            this.User = this.authService.getProfile().subscribe(data => {
              this.User = data.user;
              for (let i = 0; i < data.user.ratedMovies.length; i++) {
                if (data.user.ratedMovies[i].id === this.movieFromDb._id) {
                  this.starsCount = data.user.ratedMovies[i].rate;
                }
              }
            });

            //GET movie from TMDb
            this.movieService.getMovieTMDb(id, movie.Type).subscribe(data => {
              this.percent = 100;
              this.notificationService.changeTextProgress(100);
              this.movie = movie;
              this.imdbMovie = true;
              this.movie.Budget = data.budget;
              this.movie.BackgroundImage = data.backdrop_path;
              this.movie.Tagline = data.tagline;
              this.movie.Rating = this.movieFromDb.rating;
              this.movie.NbVotes = this.movieFromDb.nbVotes;
              console.log(this.movie);
            })

            this.getComments();
            this.getRating();
          });
        }
      });
    });

    /*Observable.forkJoin([this.movie, this.User]).subscribe(results => {
      // results[0] is our character
      // results[1] is our character homeworld
      console.log(results[0]);
      
    });*/

  }

  getStyleMetascore(metascore) {
    return this.movieService.getColorMetascore(metascore);
  }

  postComment() {
    let comment = {
      title: this.titleComment,
      text: this.textComment,
      username: this.User.username,
      idUser: this.User.id,
      idMovie: this.id,
      titleMovie: this.movie.Title
    }

    this.commentService.postComment(comment).subscribe(data => {
      if (data.success === true) {
        this.notificationService.showNotifSuccess(data.msg);
        this.getComments();
      } else {
        this.notificationService.showNotifDanger(data.msg);
      }
    })
  }

  getComments() {
    this.commentService.getComments(this.id).subscribe(data => {
      if (data.success === true) {
        this.comments = data.comments;
        this.titleComment = "";
        this.textComment = "";
      } else {
        console.log(data.msg);
      }
    })
  }

  getRating() {

  }

  ngOnDestroy() {
    this.notificationService.removeProgressBar();
  }

  rate() {
    console.log(this.starsCount);
    this.addRatingMovie();
  }

  addRatingMovie() {
    let alreadyRated = false;
    let toUpdate = true

    for (let i = 0; i < this.User.ratedMovies.length; i++) {
      if (this.User.ratedMovies[i].id === this.movieFromDb._id) {
        alreadyRated = true;
        if (this.User.ratedMovies[i].rate === this.starsCount) {
          toUpdate = false;
        } else {
          this.User.ratedMovies[i].rate = this.starsCount;
        }
      }
    }

    if (alreadyRated === false) {
      this.User.ratedMovies.push({
        id: this.movieFromDb._id,
        title: this.movieFromDb.title,
        rate: this.starsCount
      });
    }

    if (toUpdate === true) {

      this.authService.updateFullProfile(this.User).subscribe(data => {
        if (data.success !== true) {
          this.notificationService.showNotifDanger("User not updated");
        }
      });

      if (alreadyRated === false) {
        this.movieFromDb.rating = ((this.movieFromDb.rating * this.movieFromDb.nbVotes) + this.starsCount) / (this.movieFromDb.nbVotes + 1);
        this.movieFromDb.nbVotes = this.movieFromDb.nbVotes + 1;
      } else {
        this.movieFromDb.rating = ((this.movieFromDb.rating * (this.movieFromDb.nbVotes - 1)) + this.starsCount) / (this.movieFromDb.nbVotes);
      }

      this.movieService.updateMovie(this.movieFromDb).subscribe(data => {

      });
    }
  }

}
