import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Voucher } from '../../models/voucher';
import { server } from '../../models/enum';

/*
  Generated class for the VoucherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VoucherProvider {
  token: string = '2bdc73c7-6614-4297-9bf4-1b03fee7c323';
  siteId: string = '1';
  headers: HttpHeaders;
  url: string = server + 'voucher';

  constructor(public http: HttpClient) {
    console.log('Hello VoucherProvider Provider');
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Content-Type', 'application/json');
  }



  public create(voucher: Voucher) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authentication-Token', this.token);
    return this.http.post(`${this.url}/create/`, voucher, { headers }).toPromise();
  }

  addVoucher(plan, voucherId: string, discount: number, userId: number, type?: number, _userId?: number, mobile?: number) {
    let headers = this.headers;
    let voucher: any = {};
    voucher.id = voucherId;
    voucher._creator = userId;
    voucher._user = type == 3 ? userId : _userId;
    voucher._plan = plan;
    voucher._mobile = mobile;
    voucher.discount = discount;
    return this.http.post(this.url, voucher, { headers }).toPromise();
  }

  getVouchers() {
    let headers = this.headers;
    return this.http.get(this.url, { headers }).toPromise();
  }

  getVendorVoucher(userId) {
    let headers = this.headers;
    return this.http.get(`${this.url}/vendor/${userId}`, { headers }).toPromise();
  }

  getUserVoucher(userId) {
    let headers = this.headers;
    return this.http.get(`${this.url}/user/${userId}`, { headers }).toPromise();
  }

  editVoucher(voucher) {
    let headers = this.headers;
    return this.http.put(this.url, voucher, { headers }).toPromise();
  }

  transferUser(voucherId, userId, mobile) {
    let headers = this.headers;
    return this.http.put(`${this.url}/transfer/${voucherId}`, { userId, mobile }, { headers }).toPromise();
  }

}
