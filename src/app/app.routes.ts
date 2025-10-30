import { Routes } from '@angular/router';
import { RidesComponent } from './rides/rides.component';
import { RideDetailComponent } from './rides/ride-detail/ride-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
    { path: '', redirectTo: 'rides', pathMatch: 'full' },
    { path: 'rides', component: RidesComponent },
    { path: 'rides/:id', component: RideDetailComponent },
    { path: 'dashboard', component: DashboardComponent }

];