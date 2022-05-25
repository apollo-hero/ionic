import { CouponConfirmationPage } from './../coupon-confirmation/coupon-confirmation';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CouponProvider } from '../../providers/coupon/coupon';
import moment from 'moment';

/**
 * Generated class for the AddCouponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-add-coupon',
    templateUrl: 'add-coupon.html',
})
export class AddCouponPage {

    coupon: any = {
        couponCode: undefined,
        isAbs: false,
        type: 'Wallet',
        value: undefined,
        minAmount: undefined,
        maxAmount: undefined,
        validity: undefined
    }

    isAdd: Boolean = false;
    isEdit: Boolean = false;
    isView: Boolean = false;


    constructor(public navCtrl: NavController, public navParams: NavParams,
        private couponPro: CouponProvider, private modalCtrl: ModalController) {
        const coup = navParams.get('coupon');
        if (coup) {
            this.isView = true;
            this.coupon = coup;
        }
        else {
            this.isAdd = true;
            this.coupon.validity = moment().toLocaleString();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddCouponPage');
    }

    addCoupon() {
        let profileModal = this.modalCtrl.create(CouponConfirmationPage, { coupon: this.coupon });
        profileModal.present();
        profileModal.onDidDismiss(data => {
            if (data['added']) this.navCtrl.pop();
        })

    }

    editCoupon() {
        this.isAdd = false;
        this.isEdit = true;
        this.isView = false;
    }

    saveCoupon() {
        this.isAdd = false;
        this.isEdit = false;
        this.isView = true;
        let profileModal = this.modalCtrl.create(CouponConfirmationPage, { coupon: this.coupon });
        profileModal.present();
        profileModal.onDidDismiss(data => {
            if (data['edited']) this.navCtrl.pop();
        })
    }

}
