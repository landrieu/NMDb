import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { CommentService } from '../../services/comment.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/Movie';
import { RatingModule } from "ngx-rating";
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
declare var YT: any;

@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.css']
})
export class InfoMovieComponent implements OnInit, AfterViewInit {
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
  srcYoutube;
  addContentData: addContent1;
  theHtmlString = "";

  constructor(private router: Router, public sanitizer: DomSanitizer, private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService, private commentService: CommentService) { }

  ngOnInit() {
    this.addContentData = new addContent1();
    this.addContentData.type = "info";

    this.notificationService.initProgressBar();
    // Get the id of the movie
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.percent = 10;
      this.notificationService.changeTextProgress(10);

      this.movieService.getMovieById(this.id).subscribe(data => {
        this.movieFromDb = data.movie;
        // Test if movie is on IMDb
        if (data.movie.imdbId === null || data.movie.imdbId === "" || data.movie.imdbId === undefined) {
          //this.movie = data.movie;
          this.movie = {};
          //this.imdbMovie = true;
          this.copyInfoMovie(data.movie);

          this.User = this.authService.getProfile().subscribe(data => {
            this.User = data.user;
            console.log(this.movie);
            
            for (let i = 0; i < data.user.ratedMovies.length; i++) {
              if (data.user.ratedMovies[i].id === this.movie._id) {
                this.starsCount = data.user.ratedMovies[i].rate;
              }
            }
          });

          this.getComments();
          this.notificationService.changeTextProgress(100);
          return true;
        } else {
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
              this.movie.Rating = Math.round(this.movieFromDb.rating * 100) / 100;
              this.movie.NbVotes = this.movieFromDb.nbVotes;
              this.movie.ContentAddedInfo = this.movieFromDb.contentAddedInfo;
              this.movie.ContentAddedSection = this.movieFromDb.contentAddedSection;
              this.movieService.getVideoMovie(this.movieFromDb.imdbId).subscribe(data => {
                this.srcYoutube = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + data.results[0].key + "?enablejsapi=1&origin=http://andrieu.herokuapp.com");
                console.log(this.movie);

              });
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

  ngAfterViewInit() {

  }

  copyInfoMovie(movie) {
    console.log(movie);
    this.movie.Title = movie.title;
    this.movie.Director = movie.director;
    this.movie.Actors = movie.actors;
    this.movie.Country = movie.location;
    this.movie.Metascore = movie.metascore;
    this.movie.Plot = movie.plot;
    this.movie.Budget = movie.budget;
    this.movie.Poster = movie.poster;
    this.movie.Rating = Math.round(movie.rating * 100) / 100;
    this.movie.NbVotes = movie.nbVotes;
    this.movie.Released = movie.releaseDate;
    this.movie._id = movie._id;
    this.movie.ContentAddedInfo = movie.contentAddedInfo;
    this.movie.ContentAddedSection = movie.contentAddedSection;
  }

  getStyleMetascore(metascore) {
    return this.movieService.getColorMetascore(metascore);
  }

  postComment() {
    let comment = {
      title: this.titleComment,
      text: this.textComment,
      username: this.User.username,
      idUser: this.User._id,
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
    this.addRatingMovie();
  }

  showUser(id) {
    console.log(id);
    console.log(this.User);

    if (id === this.User._id) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile/' + id]);
    }
  }

  addRatingMovie() {
    let alreadyRated = false;
    let index;

    for (let i = 0; i < this.User.ratedMovies.length; i++) {
      if (this.User.ratedMovies[i].id === this.movieFromDb._id) {
        index = i;
        alreadyRated = true;
      }
    }

    if (alreadyRated === false) {
      this.User.ratedMovies.push({
        id: this.movieFromDb._id,
        title: this.movieFromDb.title,
        rate: this.starsCount
      });
    }

    if (alreadyRated === false) {
      this.movieFromDb.rating = ((this.movieFromDb.rating * this.movieFromDb.nbVotes) + this.starsCount) / (this.movieFromDb.nbVotes + 1);
      this.movieFromDb.nbVotes = this.movieFromDb.nbVotes + 1;

    } else {
      this.movieFromDb.rating = ((this.movieFromDb.rating * this.movieFromDb.nbVotes) - this.User.ratedMovies[index].rate + this.starsCount) / (this.movieFromDb.nbVotes);
      this.User.ratedMovies[index].rate = this.starsCount;
    }
    this.movie.Rating = this.movieFromDb.rating;


    this.authService.updateFullProfile(this.User).subscribe(data => {
      if (data.success !== true) {
        this.notificationService.showNotifDanger("User not updated");
      }
    });


    this.movieService.updateMovie(this.movieFromDb).subscribe(data => {

    });
  }

  addContent() {
    console.log(this.addContentData.content);
    
    this.addContentData.content = this.addContentData.content.replace(/\r?\n/g, '<br />');

    if (this.addContentData.title !== "" && this.addContentData.content !== "" && this.addContentData.title !== undefined && this.addContentData.content !== undefined) {
      let content = {
        title: this.addContentData.title,
        content: this.addContentData.content,
        idUser: this.User._id,
        username: this.User.username,
        date: new Date()
      }

      if (this.addContentData.type === "info") {
        this.movieFromDb.contentAddedInfo.push(content);
      } else {
        this.movieFromDb.contentAddedSection.push(content);
      }
      this.movieService.updateMovie(this.movieFromDb).subscribe(data => {
        this.notificationService.showNotifSuccess("Content has been add to the page");
        this.addContentData.title = "";
        this.addContentData.content = "";
        $('#accordion').click();
      });
    } else {
      this.notificationService.showNotifWarning("You have to fill every field");
    }
  }
  deleteAddedContent(date) {
    for (let i = 0; i < this.movieFromDb.contentAddedSection.length; i++) {
      if (this.movie.ContentAddedSection[i].date === date) {
        this.movieFromDb.contentAddedSection.splice(i, 1);
        break;
      }
    }
    this.movieService.updateMovie(this.movieFromDb).subscribe(data => {
      if (data.success === true) {
        this.notificationService.showNotifSuccess("The content has been deleted");
      } else {
        this.notificationService.showNotifWarning("A problem occured");
      }
    });
  }
}

class addContent1 {
  title: string;
  content: string;
  idUser: string;
  username: string;
  date: Date;
  type: string;
}
