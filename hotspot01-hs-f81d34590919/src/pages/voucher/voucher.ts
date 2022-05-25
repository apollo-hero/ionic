import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { TransferVoucherPage } from '../transfer-voucher/transfer-voucher';
import { Clipboard } from '@ionic-native/clipboard';
import { ClientHomePage } from '../client-home/client-home';

/**
 * Generated class for the VoucherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-voucher',
    templateUrl: 'voucher.html',
})
export class VoucherPage {

    myVouchers: Array<any> = [];
    isCore: boolean = true;
    currentUser: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private user: UserProvider, private voucherPro: VoucherProvider,
        private clipboard: Clipboard, private platform: Platform,
        private actionSheetCtrl: ActionSheetController
    ) {
        this.isCore = this.platform.is('core') || this.platform.is('mobileweb');
    }

    ionViewWillEnter() {
        this.user.activeUser.subscribe(user => {
            this.currentUser = user;
            if (user.type == 1) {
                this.voucherPro.getVouchers().then(data => this.myVouchers = data['data']);
            } else if (user.type == 2) {
                this.voucherPro.getVendorVoucher(user._id).then(data => this.myVouchers = data['data']);
            } else {
                this.voucherPro.getUserVoucher(user._id).then(data => this.myVouchers = data['data']);
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VoucherPage');
    }

    showVoucherActionSheet(voucher) {
        let actionSheet = undefined;
        if (this.currentUser.type != 1 && (!voucher._user || voucher._user._id == this.currentUser._id) && !voucher._mobile) {
            actionSheet = this.actionSheetCtrl.create({
                title: voucher.id,
                subTitle: 'What you want to do with this voucher?',
                cssClass: 'voucherSheet',
                buttons: [
                    {
                        text: 'Transfer Voucher',
                        handler: () => {
                            this.navCtrl.push(TransferVoucherPage, {
                                voucherCode: voucher.id, new: false, voucher: voucher
                            });
                        }
                    },
                    {
                        text: 'Activate Voucher',
                        handler: () => {
                            if (!this.platform.is('core')) this.clipboard.copy(voucher.id);
                            window.open('http://scan2log.in/?voucher=' + voucher.id, '_system')
                        }
                    },
                    {
                        text: 'Copy Voucher Code',
                        handler: () => {
                            if (!this.platform.is('core')) this.clipboard.copy(voucher.id);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
        } else {
            actionSheet = this.actionSheetCtrl.create({
                title: voucher.id,
                subTitle: 'You have already transfered this voucher',
                cssClass: 'voucherSheet',
                buttons: [
                    {
                        text: 'Add Voucher',
                        handler: () => {
                            if (this.currentUser.type == 2)
                                this.navCtrl.push(ClientHomePage);
                            else if (this.currentUser.type == 3)
                                this.navCtrl.push(HomePage);
                            else
                                '';
                        }
                    },
                    {
                        text: 'Activate Voucher',
                        handler: () => {
                            if (!this.platform.is('core')) this.clipboard.copy(voucher.id);
                            window.open('http://scan2log.in/?voucher=' + voucher.id, '_system')
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
        }
        actionSheet.present();
    }

}
