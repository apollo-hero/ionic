import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { server } from '../../models/enum';

/*
  Generated class for the WalletProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WalletProvider {

    url: string = server + 'wallet';
    transaction: string = server + 'transaction';
    type: string;
    headers: HttpHeaders;

    constructor(public http: HttpClient) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.append('Content-Type', 'application/json');
    }

    getBalance(walletId) {
        const headers = this.headers;
        return this.http.get(`${this.url}/${walletId}`, { headers }).toPromise();
    }

    getTransaction(walletId) {
        const headers = this.headers;
        return this.http.get(`${this.transaction}/${walletId}`, { headers }).toPromise();
    }

    transfer(payeeWalletId, payerWalletId, amount, payerName, payeeName) {
        const headers = this.headers;
        const payLoad = {
            payee: payeeWalletId,
            payer: payerWalletId,
            amount: new Number(amount),
            description: `${payerName} transfer ${amount} to ${payeeName}`
        }
        return this.http.put(`${this.url}/transfer`, payLoad, { headers }).toPromise();
    }

    /* addTransaction(walletId, transaction) {
      const headers = this.headers;
      return this.http.put(`${this.transaction}/${walletId}`, transaction, { headers }).toPromise();
    } */

}
