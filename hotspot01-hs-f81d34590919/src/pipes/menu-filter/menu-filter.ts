import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MenuFilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'menuFilter',
})
export class MenuFilterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], filter: string) {
    if (!items || !filter) {
      return items;
    } else {
      return items.filter(item => item.type == filter || !item.type);
    }
  }
}
