import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss']
})
export class GridListComponent {
  @Input() items: any = [];
  @Input() route: string;

  constructor(private router: Router) { }

  getCoverImage(images: any[]) {
    return images[0].url ? images[0].url : '../assets/no-cover.jpg';
  }

  goTo(item: any) {
    this.router.navigate([`/${this.route}`, `${item.id}`]);
  }

}
