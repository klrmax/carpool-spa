import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RideService, SearchTerms } from '../services/ride.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})

export class SearchbarComponent {
  // Wir definieren eine Eigenschaft für unser Formular.
  // Es ist eine FormGroup, die unsere beiden Eingabefelder enthält.
  public searchForm = new FormGroup({
    // Jedes Feld ist ein FormControl. Der erste Parameter ist der Startwert.
    from: new FormControl(''),
    to: new FormControl(''),
    date: new FormControl(''),
    time: new FormControl(''),  
    seats: new FormControl(null)
  });
  constructor(private rideService: RideService) {}

  onSearch(): void {
    
    console.log('Form Value:', this.searchForm.value);
    console.log('Date:', this.searchForm.value.date);
    console.log('Time:', this.searchForm.value.time);
    
    this.rideService.updateSearchTerms(this.searchForm.value as SearchTerms);
  }
}