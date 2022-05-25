import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';

/**
 * Generated class for the ViewVendorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-vendor',
  templateUrl: 'view-vendor.html',
})
export class ViewVendorPage {

  vendor: any = {};
  editable: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private vendorPro: VendorProvider) {
    this.vendor = this.navParams.get('vendor')
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
