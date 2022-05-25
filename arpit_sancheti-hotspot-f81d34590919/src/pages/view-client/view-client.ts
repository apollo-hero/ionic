import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';

/**
 * Generated class for the ViewClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-view-client',
    templateUrl: 'view-client.html',
})
export class ViewClientPage {

    vendor: any = {};
    editable: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private vendorPro: VendorProvider) {
        this.vendor = this.navParams.get('vendor')
        debugger
        this.editable = this.navParams.get('edit');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ViewVendorPage');
    }

    update() {
        this.editable = false;
        this.vendorPro.editVendor(this.vendor);
    }

    edit() {
        this.editable = true;
    }
}
