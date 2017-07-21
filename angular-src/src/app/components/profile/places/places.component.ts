import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
declare var google: any;
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, OnDestroy {
  @Input () placesUser;
  latitude: number = 0;
  longitude: number = 0;
  
  zoom: number = 7;
  location: String;
  type: String;
  title: String;

  displayMapToSee;
  displayMapSeen;

  markersToSee = [];
  markersSeen = [];

  showMap: boolean = false;
  map;
  markers = [];

  constructor(private locationService: LocationService, private notificationService: NotificationService, private authService: AuthService) { }

  ngOnInit() {
    /*this.authService.getProfile().subscribe( data => {
      data.user.placesToSee.forEach(element => {

      });
    })*/

    var options = {
      zoom: 4,
      center: {
        lat:42,
        lng: -10
      },
      fullscreenControlOptions: {
        position: 'LEFT_TOP'
      },
      mapTypeId: 'satellite'
    }
    this.map = new google.maps.Map(document.getElementById('map'),options);
    console.log("A");

  }

  showMapToSee(){
    if(this.placesUser.placesToSee.length === 0){
      this.notificationService.showNotifWarning("There is no places to see")
    }else{
      this.setMarkers(this.placesUser.placesToSee);
    }
  }

  showMapSeen(){
    if(this.placesUser.placesSeen.length === 0){
      this.notificationService.showNotifWarning("There is no places see")
    }else{
      this.setMarkers(this.placesUser.placesSeen);
    }
  }

  setMarkers(places){
    this.deleteMarkers();
    this.displayMap();
    
    places.forEach(element => {
      this.addMarker(
          {
            coords:{lat: element.latitude, lng: element.longitude},
            content: element.title
        });
        this.latitude = element.latitude;
        this.longitude = element.longitude;
    });
      this.setCenterMap();
      this.setBounds();
  }

  setBounds(){
    if(this.markers.length > 1){
    var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].getPosition());
      }

      this.map.fitBounds(bounds);
    }
  }

  setCenterMap(){
    this.map.panTo(new google.maps.LatLng(this.latitude,this.longitude));
  }
   hideMap(){
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
  }
  displayMap(){
  
    $('#map').css('height','400px');
    google.maps.event.trigger(document.getElementById('map'), 'resize');
    this.map.panTo(new google.maps.LatLng(this.latitude,this.longitude));
    this.map.setZoom(this.zoom);
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
        this.deleteMarkers();
        this.addMarker({coords:{
          lat: this.latitude,
          lng: this.longitude
        }})
        this.displayMap();
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
        this.notificationService.showNotifWarning("Place not found");;
      }    
    });
  }

  deleteMarkers(){
    if(this.markers){
          for(let i=0; i<this.markers.length; i++){
            this.markers[i].setMap(null);
          }
    }
    this.markers = [];
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
            this.title = "";
            console.log(this.placesUser);
          }
        })
      }else{
        this.notificationService.showNotifSuccess(data.msg);
      }
    });
  }

  ngOnDestroy(){
    
  }

  addMarker(props){
    var marker = new google.maps.Marker({
      position: props.coords,
      map:this.map
    })

    if(props.content){
      var infoWindow = new google.maps.InfoWindow({
      content: props.content
    })
    
    marker.addListener('click',function(){
        infoWindow.open(this.map,marker);
    });
  }
    this.markers.push(marker);
  }

  deletePlace(timeStamp, type){
    let param = {
      type: type,
      timeStamp: timeStamp,
      id: this.placesUser._id
    }
    this.locationService.deletePlace(param).subscribe( data =>{
      if(data.success === true){
        this.notificationService.showNotifSuccess(data.msg);
        this.authService.getProfile().subscribe( user => {
          if(user){
            this.placesUser = user.user;
          }
        })
      }else{
        this.notificationService.showNotifDanger(data.msg);
      }
    })
  }

}
