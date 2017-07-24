import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { CommentService } from '../../services/comment.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/Movie';
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
  imdbMovie: boolean = false;
  textComment;
  titleComment;
  User;
  comments = [];
  percent = 0;

  constructor(private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService, private commentService: CommentService) { }

  ngOnInit() {
    this.notificationService.initProgressBar();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.percent = 10;
      this.notificationService.changeTextProgress(10);

      this.movieService.getMovieById(this.id).subscribe(data => {
        if (data.movie.imdbId === null || data.movie.imdbId === "" || data.movie.imdbId === undefined) {
          this.movie = data.movie;
          console.log(this.movie);
          this.getComments();
          return true;
        } else {
          let id = data.movie.imdbId;
          this.movieService.getMovieIMDbByIdBack(id).subscribe(movie => {
            this.percent = 60;
            this.notificationService.changeTextProgress(60);
            this.movieService.getMovieTMDb(id, movie.Type).subscribe(data => {
              this.percent = 100;
              this.notificationService.changeTextProgress(100);
              this.movie = movie;
              this.imdbMovie = true;
              this.movie.Budget = data.budget;
              this.movie.BackgroundImage = data.backdrop_path;
              this.movie.Tagline = data.tagline;
              console.log(this.movie);
            })

            this.getComments();
          });
        }
      });
    });
    this.User = this.authService.getUser();
    console.log(this.User);
  }

  getStyleMetascore(metascore) {
    if (metascore != null) {
      if (metascore === "N/A") {
        return 'no-metascore';
      }
      if (metascore < 40) {
        return 'metascore-red';
      }
      if (metascore < 60) {
        return 'metascore-orange';
      }
      if (metascore < 75) {
        return 'metascore-yellow';
      }
      if (metascore < 90) {
        return 'metascore-green';
      }
      if (metascore <= 100) {
        return 'metascore-greener';
      }
    }
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

  progress() {
    console.log("nj");
    if (this.movie) {
      // $(".progress").fadeOut(1000);
    }
    return true;
  }

  ngOnDestroy() {
    this.notificationService.removeProgressBar();
  }

}
