import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { server } from '../../models/enum';

/*
  Generated class for the CouponProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CouponProvider {

    url: string = server + 'coupons';
    type: string;
    headers: HttpHeaders;

    constructor(public http: HttpClient) {
        console.log('Hello CouponProvider Provider');
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('Content-Type', 'application/json');
    }

    addCoupon(coupon) {
        let headers = this.headers;
        return this.http.post(this.url, coupon, { headers }).toPromise();
    }

    editCoupon(coupon) {
        let headers = this.headers;
        return this.http.put(`${this.url}/${coupon._id}`, coupon, { headers }).toPromise();
    }

    walletCoupon(couponCode) {
        let headers = this.headers;
        return this.http.get(`${this.url}/wallet/${couponCode}`, { headers }).toPromise();
    }

    transCoupon(couponCode) {
        let headers = this.headers;
        return this.http.get(`${this.url}/trans/${couponCode}`, { headers }).toPromise();
    }

    getAll() {
        return this.http.get(`${this.url}`).toPromise();
    }

}
