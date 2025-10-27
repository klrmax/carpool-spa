import { Routes } from '@angular/router';
import { RidesComponent } from './rides/rides.component';
import { RideDetailComponent } from './rides/ride-detail/ride-detail.component';
import { CreateRideComponent } from './create-ride/create-ride.component';

export const routes: Routes = [
    { path: '', redirectTo: 'rides', pathMatch: 'full' },
    { path: 'rides', component: RidesComponent },
    { path: 'rides/new', component: CreateRideComponent }, 
    { path: 'rides/:id', component: RideDetailComponent }
];