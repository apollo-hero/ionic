import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserType, server } from '../../models/enum';

/*
  Generated class for the PlansProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlansProvider {
  url: string = server + 'plans';
  type: string;
  headers: HttpHeaders;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello PlansProvider Provider');
    this.storage.get('type').then(d => this.type = d);
    const type = UserType.ADMIN.toString();
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Authentication-Token', type);
  }

  addPlan(plan) {
    let headers = this.headers;
    return this.http.post(this.url, plan, { headers }).toPromise();
  }

  getPlans() {
    let headers = this.headers;
    return this.http.get(this.url, { headers }).toPromise();
  }

  editPlan(plan) {
    let headers = this.headers;
    return this.http.put(this.url + '/' + plan._id, plan, { headers }).toPromise();
  }

  deletePlan(planId) {
    let headers = this.headers;
    return this.http.delete(`${this.url}/${planId}`, { headers }).toPromise();
  }


}
