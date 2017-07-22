import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { CommentService } from '../../services/comment.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/Movie'

@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.css']
})
export class InfoMovieComponent implements OnInit {
  id: String;
  private sub: any;
  movie;
  imdbMovie: boolean= false;
  textComment;
  titleComment;
  User;
  comments= [];

  constructor(private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService, private commentService: CommentService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id']; 
       
       this.movieService.getMovieById(this.id).subscribe( data =>{
         if(data.movie.imdbId === null || data.movie.imdbId === "" || data.movie.imdbId === undefined){
           this.movie = data.movie;
            console.log(this.movie);
            this.getComments();
           return true;
         }else{
           let id = data.movie.imdbId;
           this.movieService.getMovieIMDbByIdBack(id).subscribe(movie =>{
            this.movie = movie;
            this.imdbMovie = true;
            console.log(this.movie);
            this.getComments();
           });
         }
       });
    });
    this.User = this.authService.getUser();
    console.log(this.User);
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

  postComment(){
     let comment = {
       title: this.titleComment,
       text: this.textComment,
       username: this.User.username,
       idUser: this.User.id,
       idMovie: this.id,
       titleMovie: this.movie.Title
     }

     this.commentService.postComment(comment).subscribe( data =>{
       if(data.success === true){
        this.notificationService.showNotifSuccess(data.msg);
        this.getComments();
       }else{
        this.notificationService.showNotifDanger(data.msg);
       }
     })
  }

  getComments(){
    this.commentService.getComments(this.id).subscribe(data =>{
      if(data.success === true){
        this.comments= data.comments;
        this.titleComment = "";
        this.textComment = "";
      }else{
        console.log(data.msg);
      }
    })
  }
  

}
