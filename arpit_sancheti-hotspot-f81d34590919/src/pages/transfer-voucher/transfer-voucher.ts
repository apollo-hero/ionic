import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { ToastProvider } from '../../providers/toast/toast';
import { ClientHomePage } from '../client-home/client-home';

/**
 * Generated class for the TransferVoucherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transfer-voucher',
  templateUrl: 'transfer-voucher.html',
})
export class TransferVoucherPage {

  mobile: string = '(767)';
  user: any = {};
  userSelected: boolean = false;
  voucherId: any;
  new: boolean;
  numberEntered: boolean = false;
  voucher: any = {};
  masks: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private vendorPro: VendorProvider, private voucherPro: VoucherProvider,
    private toast: ToastProvider) {
    this.voucherId = navParams.get('voucherCode');
    this.new = navParams.get('new');
    this.voucher = navParams.get('voucher');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferVoucherPage');
  }

  search() {
    let mobile = this.mobile.replace(/\D+/g, '');
    this.vendorPro.searchUser(mobile).then(res => {
      if (res['success']) {
        if (res['data']) {
          this.user = res['data']; this.userSelected = true;
        } else {
          this.toast.presentToast('No user is registered with this number', 'toastInfo');
          this.numberEntered = true;
        }
      }
    })
  }

  transfer() {
    let userId = this.user ? this.user._id : undefined;
    let mobile = this.mobile.replace(/\D+/g, '');
    this.voucherPro.transferUser(this.voucherId, userId, mobile).then(() => {
      this.toast.presentToast(this.new ? 'Voucher Created Succssfully' : 'Voucher Transfered Succssfully', 'toastSuccess')
      if (this.new) this.navCtrl.setRoot(ClientHomePage);
      else this.navCtrl.pop();
    });
  }

  numberChanged() {
    this.userSelected = false;
  }

}
