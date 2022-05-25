import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic2-auto-complete';
import { server } from '../../models/enum';

/*
  Generated class for the UserAutoCompleteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserAutoCompleteProvider implements AutoCompleteService {
  labelAttribute = "mobile";
  constructor(public http: HttpClient) {
    console.log('Hello UserAutoCompleteProvider Provider');
  }

  getResults(keyword: string) {
    return this.http.get(server + "vendors/users")
      .map(
        result => {
          return result['data'].filter(
            item => item.mobile.toString().toLowerCase().startsWith(keyword.toLowerCase())
              || item.name.toString().toLowerCase().includes(keyword.toLowerCase()))
        });
  }

}
