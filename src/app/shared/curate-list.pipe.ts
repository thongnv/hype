import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCurateList'
})
export class CurateListPipe implements PipeTransform {

  public transform(items: any[], categoryId: string): any {
    if (!items || !categoryId || categoryId === 'all') {
      return items;
    }
    return items.filter((item) => item.info.category_id === categoryId );
  }

}
