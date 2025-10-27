import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Wichtig: Diese Module importieren, um mit Reactive Forms zu arbeiten
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
    date: new FormControl('')
  });
  
  constructor(private rideService: RideService) {}

  onSearch(): void {
    // Hier werden wir später die Suche auslösen.
    // Fürs Erste geben wir die Werte nur in der Browser-Konsole aus.
this.rideService.updateSearchTerms(this.searchForm.value as SearchTerms);
    console.log(this.searchForm.value);
    }
}