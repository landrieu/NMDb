import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings'
import 'rxjs/add/operator/map';

@Injectable()
export class CommentService {

  constructor(private http: Http) { }

  postComment(comment){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post( AppSettings.API_ENDPOINT + 'comments/postComment', comment ,{headers: headers})
    .map( res => res.json());
  }

  getComments(idMovie){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'comments/commentsMovie/' + idMovie, {headers: headers})
    .map( res => res.json());
  }

  getCommentsUser(idUser){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'comments/commentsUser/' + idUser, {headers: headers})
    .map( res => res.json());
  }

  

}
