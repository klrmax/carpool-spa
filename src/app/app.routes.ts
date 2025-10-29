import { Routes } from '@angular/router';
import { RidesComponent } from './rides/rides.component';
import { RideDetailComponent } from './rides/ride-detail/ride-detail.component';
import { LoginComponent } from './login/login.component'; 
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'rides', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'rides', component: RidesComponent },
    { path: 'rides/:id', component: RideDetailComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }

];