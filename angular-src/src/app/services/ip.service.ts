import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings'
import 'rxjs/add/operator/map';

@Injectable()
export class IpService {

  constructor(private http: Http) { }

  postIP(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(AppSettings.API_ENDPOINT + 'ips/postIP', {}, { headers: headers })
      .map(res => res.json());
  }

}
