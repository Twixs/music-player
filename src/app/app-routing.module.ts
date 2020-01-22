import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackListComponent } from './components/track-list/track-list.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'category/:id',
    component: CategoryComponent,
  },
  {
    path: 'tracks/:id',
    component: TrackListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
