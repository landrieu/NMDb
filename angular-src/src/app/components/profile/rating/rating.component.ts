import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input () ratingUser;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
  
  }

}
