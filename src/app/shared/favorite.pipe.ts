import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFavorite'
})
export class FavoritePipe implements PipeTransform {

  public transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => item.type === filter);
  }

}
