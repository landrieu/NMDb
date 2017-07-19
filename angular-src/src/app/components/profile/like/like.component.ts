import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef,  } from '@angular/core';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
declare var google: any;
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit, AfterViewInit {
  @Input () likeUser;
  showMap: boolean = false;
 
  map;
  hide:boolean = true;

  constructor(private authService: AuthService) { }
  ngAfterViewInit(){

  
  }
  hideMap(){
    google.maps.event.clearInstanceListeners(window);
google.maps.event.clearInstanceListeners(document);
  }
  displayMap(){
          $('#map').css('height','400px');
          google.maps.event.trigger(document.getElementById('map'), 'resize');
          this.map.panTo(new google.maps.LatLng(43,-71));
  }
  ngOnInit() {
    this.authService.getProfile().subscribe( data => {
      data.user.placesToSee.forEach(element => {
      this.addMarker(
          {
            coords:{lat: element.latitude, lng: element.longitude},
            content: element.title
        });
      });
     
      
    })
    
      var options = {
      zoom: 4,
      center: {
        lat:42,
        lng: -10
      },
      fullscreenControlOptions: {
        position: 'LEFT_TOP'
      }
    }
    this.map = new google.maps.Map(document.getElementById('map'),options);
    console.log("A");
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
  
  }
}