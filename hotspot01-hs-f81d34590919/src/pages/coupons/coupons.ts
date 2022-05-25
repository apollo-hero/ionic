import { AddCouponPage } from './../add-coupon/add-coupon';
import { CouponProvider } from './../../providers/coupon/coupon';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CouponsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-coupons',
    templateUrl: 'coupons.html',
})
export class CouponsPage {

    coupons: Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private couponPro: CouponProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CouponsPage');
        this.couponPro.getAll()
            .then(res => this.coupons = res['data']);
    }

    addNew() {
        this.navCtrl.push(AddCouponPage)
    }

    viewCoupon(coupon) {
        this.navCtrl.push(AddCouponPage, { coupon })
    }

}
