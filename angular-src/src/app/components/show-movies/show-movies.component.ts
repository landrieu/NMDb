import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-show-movies',
  templateUrl: './show-movies.component.html',
  styleUrls: ['./show-movies.component.css']
})
export class ShowMoviesComponent implements OnInit, AfterViewInit {
  movies: Movie[];
  user: User;
  likedMovies = [];
  imagePath = "/assets/images/icons/empty-heart.png";
  fullHeart = "/assets/images/icons/full-heart.png";
  emptyHeart = "/assets/images/icons/empty-heart.png";
  heartArray: Array<boolean> = [];

  constructor(private movieService: MovieService, private notificationService: NotificationService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.notificationService.initProgressBar();
    this.movieService.getMovies().subscribe(res => {
      this.notificationService.changeTextProgress(90);
      this.movies = res.movies;
      this.authService.getProfile().subscribe(profile => {
        this.notificationService.changeTextProgress(100);
        this.user = profile.user;
        this.likedMovies = this.user.likedMovies;
        for (let i = 0; i < this.movies.length; i++) {
          this.heartArray[i] = false;
          for (let j = 0; j < this.likedMovies.length; j++) {
            if (this.movies[i]._id === this.likedMovies[j].id) {
              this.heartArray[i] = true;
            }
          }
        }
        console.log(this.heartArray);
      },
        err => {
          console.log(err);
          return false;
        });
    });




  }

  isEmpty(stuff) {
    if (stuff !== null && stuff !== undefined && stuff !== "" && stuff !== "N/A") {
      return true;
    } else {
      return false;
    }
  }

  getStyleMetascore(metascore) {
    return this.movieService.getColorMetascore(metascore);
  }

  editMovie() {
    console.log("edit");

  }

  deleteMovie(id) {
    console.log(id);
    this.movieService.deleteMovie(id).subscribe(data => {
      if (data.success === true) {
        this.notificationService.showNotifSuccess(data.msg);
        this.movieService.getMovies().subscribe(res => {
          this.movies = res.movies;
        });
      } else {
        this.notificationService.showNotifDanger(data.msg);
      }
    });
  }

  addLikedMovie(id, title, i) {
    this.heartArray[i] = true;

    for (let i = 0; i < this.likedMovies.length; i++) {
      if (this.likedMovies[i].id === id) {
        console.log("Movie Already in Db");
        return false;
      }
    }
    
    let movie = {
      id: id,
      title: title,
      type: "likedMovie"
    };
    this.authService.addLikedMovie(movie).subscribe(data => {

    });
  }

  deleteLikedMovie(id, title, i){
    this.heartArray[i] = false;

      for(let i = 0; i < this.user.likedMovies.length; i++){
      if(this.user.likedMovies[i].id === id){
        this.user.likedMovies.splice(i, 1);
      }
    }
    console.log(this.user);
    this.authService.updateFullProfile(this.user).subscribe( data => {      
    })
    
  }


  getHeart(movieId) {
    for (let i = 0; i < this.likedMovies.length; i++) {
      if (this.likedMovies[i].id === movieId) {
        return this.fullHeart;
      }
    }
    return this.emptyHeart;
  }

  ngAfterViewInit() {
    $(".info-movie").hover(function () {
      console.log("a");
    });

  }
    ngOnDestroy() {
    this.notificationService.removeProgressBar();
  }


}

