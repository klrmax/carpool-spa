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
  styleUrls: ['./ride-detail.component.css']
})
export class RideDetailComponent implements OnInit {
  public ride$!: Observable<Ride | undefined>;
  public isRequesting = false;
  public requestSuccess = false;
  public requestError: string | null = null;
  private rideId!: number;

  constructor(
    private route: ActivatedRoute,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    this.rideId = +this.route.snapshot.paramMap.get('id')!;
    this.ride$ = this.rideService.getRideById(this.rideId);
  }

  sendRequest(): void {
    if (this.isRequesting) return;
    
    this.isRequesting = true;
    this.requestSuccess = false;
    this.requestError = null;

    this.rideService.sendRideRequest(this.rideId).subscribe({
      next: () => {
        this.requestSuccess = true;
        this.isRequesting = false;
      },
      error: (error) => {
        this.requestError = error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
        this.isRequesting = false;
      }
    });
  }
}