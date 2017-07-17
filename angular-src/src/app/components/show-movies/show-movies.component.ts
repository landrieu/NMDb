import { Component, OnInit, AfterViewInit} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user';
import { Router } from '@angular/router';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-show-movies',
  templateUrl: './show-movies.component.html',
  styleUrls: ['./show-movies.component.css']
})
export class ShowMoviesComponent implements OnInit, AfterViewInit {
  movies: Movie[];
  user: User;
  likedMovies = [];
  imagePath = "/assets/locale/images/icons/empty-heart.png";
  fullHeart = "/assets/locale/images/icons/full-heart.png";
  emptyHeart =  "/assets/locale/images/icons/empty-heart.png";

  constructor(private movieService: MovieService,private notificationService: NotificationService, private authService: AuthService,  private router: Router) { }

  ngOnInit() {
    
    this.movieService.getMovies().subscribe( res => {
      this.movies = res.movies;
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.likedMovies = this.user.likedMovies;
    },
    err => {
      console.log(err);
      return false;
    });

  
    
  }

  isEmpty(stuff){
    if(stuff !== null && stuff !== undefined && stuff !== "" && stuff !== "N/A"){
      return true;
    }else{
      return false;
    }
  }

  getStyleMetascore(metascore){
    if(metascore != null){
      if(metascore === "N/A"){
        return 'no-metascore';
      }
      if(metascore  < 40){
        return 'metascore-red';
      }
      if(metascore <60){
        return 'metascore-orange';
      }
      if(metascore < 75){
        return 'metascore-yellow';
      }
      if(metascore < 90){
        return 'metascore-green';
      }
      if(metascore <= 100){
        return 'metascore-greener';
      }
    }
  }

  editMovie(){
    console.log("edit");
    
  }

  deleteMovie(id){
    console.log(id);
    this.movieService.deleteMovie(id).subscribe( data =>{
      if(data.success === true){
        this.notificationService.showNotifSuccess(data.msg);
        this.movieService.getMovies().subscribe( res => {
          this.movies = res.movies;
        });
      }else{
        this.notificationService.showNotifDanger(data.msg);
      }
    });
  }

  addLikedMovie(id, title){

    for(let i=0; i<this.likedMovies.length; i++){
      if(this.likedMovies[i].id === id){
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


  getHeart(movieId){
    
    

    for(let i=0; i < this.likedMovies.length; i++){
      if(this.likedMovies[i].id === movieId){
        return this.fullHeart;
      }
    }
    return this.emptyHeart;
  } 

  ngAfterViewInit(){
    console.log("vsdq");

   $('#main-title').text("HALLO! ^_^");
   $(".info-movie").hover(function(){
    console.log("a");
   });

  }
  

}

