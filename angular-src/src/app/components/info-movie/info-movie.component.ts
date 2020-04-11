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
  addContentData: addContent;
  theHtmlString = "";
  like: boolean = false;

  // Path of the heart icons
  fullHeart = "/assets/images/icons/full-heart.png";
  emptyHeart = "/assets/images/icons/empty-heart.png";

  constructor(private router: Router, public sanitizer: DomSanitizer, private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService, private commentService: CommentService) { }

  // 1st Step: Get the IMDb ID from the Db
  // 2nd A Step: If there is an IMDb ID, get the info of the movie from the OMDb and TMDb APIs
  // 2nd B Step: If there isn't an IMDb ID, get the info from the Db
  // 3rd Step: Copy the data from the Db or APIs
  // 4th Step: Get the comments of the movie from the Db
  // 5th Step: Get rating from the Db

  ngOnInit() {
    // Init AddContent
    this.addContentData = new addContent();
    this.addContentData.type = "info";
    this.notificationService.initProgressBar();
    this.User = {};

    // Get the id of the movie from the URL
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

          if (this.authService.loggedIn()) {
            this.User = this.authService.getProfile().subscribe(data => {
              this.User = data.user;

              // Get the user rating and if the movie is liked
              for (let i = 0; i < data.user.ratedMovies.length; i++) {
                if (data.user.ratedMovies[i].id === this.movie._id) {
                  this.starsCount = data.user.ratedMovies[i].rate;
                }
              }
              for (let i = 0; i < data.user.likedMovies.length; i++) {
                if (data.user.likedMovies[i].id === this.movieFromDb._id) {
                  this.like = true;
                }
              }
            });
          }

          // Get the comments of the movie
          this.getComments();
          this.notificationService.changeTextProgress(100);
          return true;

        } else {
          let id = data.movie.imdbId;
          // Get movie from OMDb
          this.movieService.getMovieIMDbByIdBack(id).subscribe(movie => {
            this.percent = 60;
            this.notificationService.changeTextProgress(60);

            if (this.authService.loggedIn()) {
              this.User = this.authService.getProfile().subscribe(data => {
                this.User = data.user;

                for (let i = 0; i < data.user.ratedMovies.length; i++) {
                  if (data.user.ratedMovies[i].id === this.movieFromDb._id) {
                    this.starsCount = data.user.ratedMovies[i].rate;
                  }
                }
                for (let i = 0; i < data.user.likedMovies.length; i++) {
                  if (data.user.likedMovies[i].id === this.movieFromDb._id) {
                    this.like = true;
                  }
                }
              });
            }

            //Get movie from TMDb
            this.movieService.getMovieTMDb(id, movie.Type).subscribe(data => {
              console.log("fefze", data);
              //Copy the data
              this.percent = 100; 
              this.notificationService.changeTextProgress(100);
              this.movie = movie;
              this.imdbMovie = true;
              this.movie.Title = data.original_title;
              this.movie.Budget = data.budget;
              this.movie.BackgroundImage = data.backdrop_path;
              this.movie.Tagline = data.tagline;
              this.movie.Plot = data.overview;
              this.movie.Released = data.release_date;
              this.movie.Rating = Math.round(this.movieFromDb.rating * 100) / 100;
              this.movie.NbVotes = this.movieFromDb.nbVotes;
              this.movie.ContentAddedInfo = this.movieFromDb.contentAddedInfo;
              this.movie.ContentAddedSection = this.movieFromDb.contentAddedSection;
              this.movieService.getVideoMovie(this.movieFromDb.imdbId).subscribe(data => {
                this.srcYoutube = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + data.results[0].key + "?enablejsapi=1&origin=http://andrieu.herokuapp.com");
              });
            })

            // Get comments and rating
            this.getComments();
            this.getRating();
            $('html,body').animate({
              scrollTop: 0
            }, 700);
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

  /*
   *  Copy the data, if there isn't an IMDb ID
   *  @input: movie to copy
   */
  copyInfoMovie(movie) {
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

  /*
   *  Return the background color of the metascore div
   *  @input: movie metascore
   */
  getStyleMetascore(metascore) {
    return this.movieService.getColorMetascore(metascore);
  }

  /*
   *  Post a comment on the Db
   */
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

  /*
   *  Get comments from the Db
   */
  getComments() {
    this.commentService.getComments(this.id).subscribe(data => {
      if (data.success === true) {
        this.comments = data.comments;
        // Clear inputs
        this.titleComment = "";
        this.textComment = "";
      }
    })
  }

  getRating() {

  }

  /*
   *  Remove the progress bar when the component is destroyed
   */
  ngOnDestroy() {
    this.notificationService.removeProgressBar();
  }

  /*
   *  Redirect to the profile
   */
  showUser(id) {

    if (id === this.User._id) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile/' + id]);
    }
  }

  /*
   *  Add a rate to the movie
   */
  addRatingMovie() {
    let alreadyRated = false;
    let index;

    //Search if the movie has already been rated by the user
    for (let i = 0; i < this.User.ratedMovies.length; i++) {
      if (this.User.ratedMovies[i].id === this.movieFromDb._id) {
        index = i;
        alreadyRated = true;
      }
    }

    // Add the rating to the user profile
    if (alreadyRated === false) {
      this.User.ratedMovies.push({
        id: this.movieFromDb._id,
        title: this.movieFromDb.title,
        rate: this.starsCount
      });
    }

    // Compute the new rating
    if (alreadyRated === false) {
      this.movieFromDb.rating = ((this.movieFromDb.rating * this.movieFromDb.nbVotes) + this.starsCount) / (this.movieFromDb.nbVotes + 1);
      this.movieFromDb.nbVotes = this.movieFromDb.nbVotes + 1;

    } else {
      this.movieFromDb.rating = ((this.movieFromDb.rating * this.movieFromDb.nbVotes) - this.User.ratedMovies[index].rate + this.starsCount) / (this.movieFromDb.nbVotes);
      this.User.ratedMovies[index].rate = this.starsCount;
    }
    this.movie.Rating = this.movieFromDb.rating;
    this.movie.NbVotes = this.movieFromDb.nbVotes;

    // Save the profile with the new rating
    this.authService.updateFullProfile(this.User).subscribe(data => {
      if (data.success !== true) {
        this.notificationService.showNotifDanger("User not updated");
      }
    });

    // Save the rating
    this.movieService.updateMovie(this.movieFromDb).subscribe(data => {

    });
  }

  /*
   *  Add Content to the movie
   *  There are two kinds of contents: Info and Section
   *  Info is displayed in the description of the movie
   */
  addContent() {

    // Backline save in the Db
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
        this.notificationService.showNotifSuccess("Content has been added to the page");
        this.addContentData.title = "";
        this.addContentData.content = "";
        $('#accordion').click();
      });
    } else {
      this.notificationService.showNotifWarning("You have to fill every field");
    }
  }

  /*
   *  Delete a Content added
   *  It can be deleted only by the user who added the content
   */
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

  /*
   *  Remove a liked movie from the user data
   */
  deleteLikedMovie() {

    for (let i = 0; i < this.User.likedMovies.length; i++) {
      if (this.User.likedMovies[i].id === this.movieFromDb._id) {
        this.User.likedMovies.splice(i, 1);
        this.like = false;
      }
    }

    this.authService.updateFullProfile(this.User).subscribe(data => {

    })
  }

  /*
   *  Add a like movie to the user profile
   */
  addLikedMovie() {

    this.like = true;
    let movie = {
      id: this.movieFromDb._id,
      title: this.movieFromDb.title
    };

    this.User.likedMovies.push(movie);
    this.authService.updateFullProfile(this.User).subscribe(data => {
      //console.log(data);
    })
  }
}

class addContent {
  title: string;
  content: string;
  idUser: string;
  username: string;
  date: Date;
  type: string;
}
