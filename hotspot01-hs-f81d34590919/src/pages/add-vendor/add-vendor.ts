import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast/toast';
import { VendorProvider } from '../../providers/vendor/vendor';

/**
 * Generated class for the AddVendorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-vendor',
  templateUrl: 'add-vendor.html',
})
export class AddVendorPage {
  vendor: any = { isActive: false };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastPro: ToastProvider, private vendorPro: VendorProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddVendorPage');
  }

  create() {
    this.vendorPro.addVendor(this.vendor)
      .then(res => {
        if (res['success']) {
          this.toastPro.presentToast('Vendor Added Succesfully', 'toastSuccess');
          this.navCtrl.pop();
        } else {
          this.toastPro.presentToast(res['msg'], 'toastError');
        }
      })
      .catch(() => this.toastPro.presentToast('Api not active', 'toastError'));
  }

}
