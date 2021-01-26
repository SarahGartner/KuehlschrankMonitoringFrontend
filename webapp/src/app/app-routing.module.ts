import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FridgesComponent } from './pages/fridges/fridges.component';
import { FridgeSensordataComponent } from './pages/fridge-sensordata/fridge-sensordata.component';
import { InformationComponent } from './pages/information/information.component';

const routes: Routes = [
  { path: '', component: FridgesComponent },
  { path: 'einzelansicht/:id', component: FridgeSensordataComponent },
  { path: 'einzelansicht', component: FridgeSensordataComponent },
  { path: 'info', component: InformationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [FridgesComponent, FridgeSensordataComponent]
