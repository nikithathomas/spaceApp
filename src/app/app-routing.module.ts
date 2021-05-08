import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { SpaceVehicleComponent } from './space-vehicle/space-vehicle.component';

const routes: Routes = [
  { path: 'space-result', component: ResultsComponent },
  { path: 'home', component: SpaceVehicleComponent },
  { path: '**', redirectTo: '/home' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
