import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  @Input () placesUser;
  latitude: number = 0;
  longitude: number = 0;
  displayMap: boolean = false;
  zoom: number = 7;
  location: String;
  type: String;
  title: String;
  toSeeArray: Array<Object>;
  mapToSeeLongitude: number = 0;
  mapToSeeLatitude: number = 0;
  displayMapToSee: boolean = false;

  constructor(private locationService: LocationService, private notificationService: NotificationService, private authService: AuthService) { }

  ngOnInit() {
    console.log("fa");
    this.authService.getProfile().subscribe( data => {
      let array = new Array();
      data.user.placesToSee.forEach(element => {
        array.push(element);
      });
      this.toSeeArray = array;
      this.mapToSeeLatitude = array[0].latitude;
      this.mapToSeeLongitude = array[0].longitude;
    });
  }

  showMapToSee(){
    this.displayMapToSee = !this.displayMapToSee;
  }

  checkLocation(){

    if(this.location === undefined){
      return false;
    }
   
    this.locationService.getLocation(this.location).subscribe(location =>{
      if(location.results.length != 0){
        this.location = location.results[0].formatted_address;
        this.latitude = location.results[0].geometry.location.lat;
        this.longitude = location.results[0].geometry.location.lng;
        this.displayMap = true;
        this.zoom = 4;
        if(location.results[0].address_components.length >= 3){
          this.zoom = 7;
        }
        if(location.results[0].address_components.length >= 5){
          this.zoom = 12;
        }
        if(location.results[0].address_components.length >= 7){
          this.zoom = 16;
        }
      }else{
        this.notificationService.showNotifWarning("Place not found");
        //this.flashMessages.show("Address not found",{cssClass: 'alert-danger',timeout:3000});
      }
      
    });
  }

  addPlace(){
    let type;
    if(this.type === "toSee"){
      type = false;
    }else{
      type = true;
    }

    let obj = {
      longitude: this.longitude,
      latitude: this.latitude,
      seen: type,
      title: this.title,
      id: this.placesUser._id,
      address: this.location
    }
    
    this.locationService.addPlace(obj).subscribe( data =>{
      if(data.success === true){
        this.notificationService.showNotifSuccess(data.msg);
        this.authService.getProfile().subscribe( user => {
          if(user){
            this.placesUser = user.user;
            console.log(this.placesUser);
          }
        })
      }else{
        this.notificationService.showNotifSuccess(data.msg);
      }
    });
  }

}
