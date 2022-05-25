import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CouponProvider } from '../../providers/coupon/coupon';

/**
 * Generated class for the CouponConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-coupon-confirmation',
    templateUrl: 'coupon-confirmation.html',
})
export class CouponConfirmationPage {
    coupon: any = {};

    constructor(public viewCtrl: ViewController, public navParams: NavParams,
        private couponPro: CouponProvider) {
        this.coupon = navParams.get('coupon');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CouponConfirmationPage');
    }

    addCoupon() {
        this.couponPro.addCoupon(this.coupon)
            .then(c => {
                this.viewCtrl.dismiss({ added: true });
            });

    }

    editCoupon() {
        this.couponPro.editCoupon(this.coupon)
            .then(c => {
                this.viewCtrl.dismiss({ edited: true });
            });

    }

    close() {
        this.viewCtrl.dismiss({ added: false });
    }

}
