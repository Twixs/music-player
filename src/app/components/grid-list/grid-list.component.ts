import { Component, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import '../../../assets/no-cover.jpg';
import * as _ from 'lodash';

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
      ? _.get(item, 'images[0].url', '../../../assets/no-cover.jpg')
      : _.get(item, 'icons[0].url', '../../../assets/no-cover.jpg');
  }

  goTo(item: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        name: item.name,
        navigatedFrom: this.route,
      },
    };

    if (this.route === 'categoryPlaylists') {
      return this.router.navigate([`/tracks`, item.id], navigationExtras);
    }

    this.router.navigate([`/${this.route}`, item.id], navigationExtras);
  }

  cutHeading(heading: string) {
    return heading.length > 32 ? heading.slice(0, 32) + '...' : heading;
  }
}
