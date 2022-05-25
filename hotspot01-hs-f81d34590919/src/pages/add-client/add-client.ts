import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast/toast';
import { VendorProvider } from '../../providers/vendor/vendor';

/**
 * Generated class for the AddClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-add-client',
    templateUrl: 'add-client.html',
})
export class AddClientPage {
    vendor: any = {
        isActive: false,
        commision: 0
    };

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
                    this.toastPro.presentToast('Client Added Succesfully', 'toastSuccess');
                    this.navCtrl.pop();
                } else {
                    this.toastPro.presentToast(res['msg'], 'toastError');
                }
            })
            .catch(() => this.toastPro.presentToast('Api not active', 'toastError'));
    }

}
