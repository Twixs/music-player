import { Component, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import get from 'lodash.get';

import '../../../assets/no-cover.jpg';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent {
  @Input() items: any = [];
  @Input() route: string;

  constructor(private router: Router) {}

  getCoverImage(item: any) {
    return item.images
      ? get(item, 'images[0].url', '../../../assets/no-cover.jpg')
      : get(item, 'icons[0].url', '../../../assets/no-cover.jpg');
  }

  goTo(item: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        name: item.name,
        type: item.type,
      },
    };

    return this.route === 'category'
      ? this.router.navigate([`/${this.route}`, item.id], navigationExtras)
      : this.router.navigate([`/tracks`, item.id], navigationExtras);
  }

  cutHeading(heading: string) {
    return heading.length > 32 ? heading.slice(0, 32) + '...' : heading;
  }
}
