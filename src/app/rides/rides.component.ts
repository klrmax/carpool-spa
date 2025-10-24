import { Component } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { RideListComponent } from '../ride-list/ride-list.component';

@Component({
  selector: 'app-rides',
  standalone: true,
  imports: [SearchbarComponent, RideListComponent],
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.css'
})
export class RidesComponent {

}
