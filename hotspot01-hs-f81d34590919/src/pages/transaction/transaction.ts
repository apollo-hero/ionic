import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WalletProvider } from '../../providers/wallet/wallet';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {

    transactions: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private walletPro: WalletProvider, private userPro: UserProvider) {
    }

    ionViewDidLoad() {
        this.userPro.activeUser.subscribe(user => {
            this.walletPro.getTransaction(user.wallet)
                .then(res => {
                    if (res['success']) {
                        this.transactions = res['data'].reverse();
                    }
                })
        });
    }

}
