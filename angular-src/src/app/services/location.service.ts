import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LocationService {
  

  constructor(private http: Http) { }
   // Observable string sources
  private componentMethodCallSource = new Subject<any>();
  private onDestroy = new Subject<any>();
  private addMarker = new Subject<any>();

  // Observable string streams
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  onDestroy$ = this.onDestroy.asObservable();
  addMarker$ = this.addMarker.asObservable();

  // Service message commands
  callComponentMethod(places, zoom) {
    places.zoom = zoom;
    this.componentMethodCallSource.next(places);
  }
  Destroy() {
    this.onDestroy.next("Yup");
  }
  Marker(marker){
    this.addMarker.next(marker);
  }

  getLocation(location){
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json',
    {
      params:{
        address: location,
        key: AppSettings.GOOGLE_MAP_KEY
      }
    })
    .map(res => res.json())
    .catch( err => err);
  }
  addPlace(param){
    let body = {
      title: param.title,
      longitude: param.longitude,
      latitude: param.latitude,
      seen: param.seen,
      address: param.address
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(body);
    return this.http.patch( AppSettings.API_ENDPOINT + 'users/edit/addPlace/' + param.id, body ,{headers: headers})
    .map( res => res.json());
  }
  deletePlace(param){
    let body = {
      type: param.type,
      timeStamp: param.timeStamp,
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(body);
    return this.http.patch( AppSettings.API_ENDPOINT + 'users/edit/deletePlace/' + param.id, body ,{headers: headers})
    .map( res => res.json());
  }
}
