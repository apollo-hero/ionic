import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { server } from '../../models/enum';

/*
  Generated class for the PlansAutoCompleteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlansAutoCompleteProvider {
  labelAttribute = "plan_name";
  constructor(public http: HttpClient) {
    console.log('Hello PlansAutoCompleteProvider Provider');
  }

  getResults(keyword: string) {
    return this.http.get(server + "plans")
      .map(
        result => {
          return result['data'].filter(item => item.plan_name.toLowerCase().includes(keyword.toLowerCase()))
        });
  }
}
