import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FridgesComponent } from './pages/fridges/fridges.component';
import { FridgeSensordataComponent } from './pages/fridge-sensordata/fridge-sensordata.component';

const routes: Routes = [
  { path: 'fridges', component: FridgesComponent },
  { path: 'sensordata', component: FridgeSensordataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [FridgesComponent, FridgeSensordataComponent]
