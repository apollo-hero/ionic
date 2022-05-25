import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';


import { UserProvider } from '../../providers/user/user';
import { WalletProvider } from '../../providers/wallet/wallet';
import { AddWalletPage } from '../add-wallet/add-wallet';
import { ChangePasswordPage } from '../change-password/change-password';
import { VendorProvider } from '../../providers/vendor/vendor';
import { ToastProvider } from '../../providers/toast/toast';
import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    user: any = {};
    balance: number;
    task: any;
    edit: boolean = false;
    constructor(public navCtrl: NavController, public navParams: NavParams,
        private userPro: UserProvider, private walletPro: WalletProvider,
        private vendorPro: VendorProvider, private toaster: ToastProvider,
        private loader: LoadingProvider, private appRate: AppRate,
        private platform: Platform) {
    }

    ionViewCanEnter() {
        this.userPro.activeUser.subscribe(user => { console.log(JSON.stringify(user)); this.user = user; });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
        this.task = setInterval(() => { this.getBalance() }, 1000);
    }

    ionViewWillUnload() {
        clearInterval(this.task);
    }

    getBalance() {
        this.walletPro.getBalance(this.user.wallet)
            .then(res => {
                if (res['success']) {
                    this.balance = res['data'];
                }
            });
    }

    addMoney() {
        this.navCtrl.push(AddWalletPage);
    }

    changePassword() {
        this.navCtrl.push(ChangePasswordPage);
    }

    save() {
        this.loader.presentLoading('Updating Profile');
        this.vendorPro.editVendor(this.user).then(res => {
            if (res['success']) {
                this.userPro.setUser(res['data']);
                this.toaster.presentToast('Profile Updated SuccessFully', 'toastSucess');
            }
            this.loader.dismissLoading();
        }).catch(err => {
            this.loader.dismissLoading();
        });
    }

    rateApp() {
        if (this.platform.is('cordova')) {
            this.appRate.preferences.storeAppURL = {
                ios: 'com.hotspot.epicnet',
                android: 'market://details?id=com.hotspot.epicnet'
            };

            this.appRate.promptForRating(true);
        }
        else {
            console.log("You are not in a cordova environment. You should test this feature in a real device or an emulator");
        }
    }

}
