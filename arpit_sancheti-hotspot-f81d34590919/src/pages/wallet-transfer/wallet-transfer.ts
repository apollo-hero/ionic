import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { WalletProvider } from '../../providers/wallet/wallet';
import { UserProvider } from '../../providers/user/user';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the WalletTransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-wallet-transfer',
    templateUrl: 'wallet-transfer.html',
})
export class WalletTransferPage {

    user: any;
    mobile: string = '(767)';
    userSelected: any;
    error: string = null;
    walletBalance: number;
    amount: number = null;

    @ViewChild('selectedUser')
    selectedUser: AutoCompleteComponent;
    @ViewChild('selectedPlan')
    selectedPlan: AutoCompleteComponent;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public userPro: UserProvider,
        public vendorPro: VendorProvider,
        public walletPro: WalletProvider
        , private loader: LoadingProvider) {
    }

    ionViewWillEnter() {
        this.userPro.activeUser.subscribe(user => {
            this.user = user;
            setInterval(() => { this.getBalance() }, 10000);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WalletTransferPage');

    }

    getBalance() {
        this.walletPro.getBalance(this.user.wallet)
            .then(res => {
                if (res['success']) {
                    this.walletBalance = res['data'];
                }
            });
    }

    pay() {
        if (!this.error) {
            this.loader.presentLoading('Paying...');
            this.walletPro.transfer(this.userSelected.wallet,
                this.user.wallet, this.amount, this.user.name, this.userSelected.name
            ).then(data => {
                this.loader.dismissLoading();
                this.navCtrl.pop();
            });
        }
    }

    search() {
        this.error = null;
        let mobile = this.mobile.replace(/\D+/g, '');
        this.vendorPro.searchUser(mobile).then(res => {
            if (res['success']) {
                if (res['data']) {
                    this.userSelected = res['data'];
                } else {
                    this.error = "User Not Found";
                }
            }
        })
    }

    unSelectUser() {
        this.userSelected = undefined;
    }

}
