import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Ride, RideService } from '../../services/ride.service';

@Component({
  selector: 'app-ride-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ride-detail.component.html',
  styleUrl: './ride-detail.component.scss'
})
export class RideDetailComponent implements OnInit {

  public ride$!: Observable<Ride | undefined>;

  // Wir injizieren hier ZWEI Services:
  // ActivatedRoute gibt uns Infos über die aktuell aktive Route (inkl. URL-Parameter).
  // RideService kennen wir schon.
  constructor(
    private route: ActivatedRoute,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    // 1. Wir holen uns die ID aus den URL-Parametern.
    // Das '+' wandelt den String (Text) aus der URL in eine number (Zahl) um.
    const rideId = +this.route.snapshot.paramMap.get('id')!;

    // 2. Wir rufen die neue Service-Methode mit dieser ID auf.
    this.ride$ = this.rideService.getRideById(rideId);
  }
}