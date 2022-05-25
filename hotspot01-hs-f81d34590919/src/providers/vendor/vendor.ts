import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType, server } from '../../models/enum';

/*
  Generated class for the VendorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VendorProvider {

    url: string = server + 'vendors';
    type: string;
    headers: HttpHeaders;

    constructor(public http: HttpClient) {
        const type = UserType.ADMIN.toString();
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('Content-Type', 'application/json');
        this.headers = this.headers.append('Authentication-Token', type);
    }

    registerToken(token, user) {
        let headers = this.headers;
        return this.http.put(`${this.url}/registerToken/${user._id}`, { token }, { headers }).toPromise();
    }

    addVendor(vendor) {
        let headers = this.headers;
        return this.http.post(this.url, vendor, { headers }).toPromise();
    }

    getVendors() {
        let headers = this.headers;
        return this.http.get(this.url, { headers }).toPromise();
    }

    getClients() {
        let headers = this.headers;
        return this.http.get(`${this.url}/users`, { headers }).toPromise();
    }

    editVendor(vendor) {
        let headers = this.headers;
        return this.http.put(`${this.url}/${vendor._id}`, vendor, { headers }).toPromise();
    }

    addBalance(userId, amount) {
        const headers = this.headers;
        return this.http.post(`${this.url}/addBalance`, { amount, userId }, { headers }).toPromise();
    }

    changePassword(userId, newObject) {
        const headers = this.headers;
        return this.http.put(`${this.url}/changePassword/${userId}`, newObject, { headers }).toPromise();
    }

    searchUser(mobile) {
        const headers = this.headers;
        return this.http.get(`${this.url}/search/${mobile}`, { headers }).toPromise();
    }

    getByUserName(userName) {
        const headers = this.headers;
        return this.http.get(`${this.url}/userName/${userName}`, { headers }).toPromise();
    }

}
