import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { RideListComponent } from '../ride-list/ride-list.component';
import { RideService } from '../services/ride.service';
import { TrainService, TrainConnection } from '../services/train.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rides',
  standalone: true,
  imports: [CommonModule, SearchbarComponent, RideListComponent],
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.css'
})
export class RidesComponent implements OnDestroy {
  trainConnections: TrainConnection[] = [];
  private searchSubscription: Subscription;

  constructor(
    private rideService: RideService,
    private trainService: TrainService,
    private router: Router
  ) {
    // Subscribe to search terms changes
    this.searchSubscription = this.rideService.searchTermsSubject.subscribe(terms => {
      if (terms.from && terms.to && terms.date) {
        // Format date for the API (YYMMDD)
        const date = new Date(terms.date);
        const formattedDate = 
          date.getFullYear().toString().slice(-2) +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          date.getDate().toString().padStart(2, '0');
        
        // Get hour from time or default to current hour
        const hour = terms.time ? terms.time.split(':')[0] : new Date().getHours().toString();
        
        this.trainService.getTrainConnections(terms.from, terms.to, formattedDate, hour)
          .subscribe(connections => {
            this.trainConnections = connections;
          });
      } else {
        this.trainConnections = [];
      }
    });
  }
  
  goToOtherPage() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
