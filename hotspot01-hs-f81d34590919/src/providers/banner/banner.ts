import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { server } from '../../models/enum';

/*
  Generated class for the BannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BannerProvider {
  url: string = server + 'banners';
  type: string;
  headers: HttpHeaders;
  constructor(public http: HttpClient) {
    console.log('Hello BannerProvider Provider');
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
  }

  addBanner(banner) {
    let headers = this.headers;
    banner.active = true;
    return this.http.post(this.url, banner, { headers }).toPromise();
  }

  getBanners() {
    let headers = this.headers;
    return this.http.get(this.url, { headers }).toPromise();
  }

  editBanner(banner) {
    let headers = this.headers;
    return this.http.put(this.url + '/' + banner._id, banner, { headers }).toPromise();
  }

}
