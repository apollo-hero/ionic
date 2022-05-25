import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the SetupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'setup',
    templateUrl: 'setup.html'
})
export class SetupComponent {

    socialData: any;
    user: any = {};
    mobile: string = "";
    isVendor: Boolean = false;

    constructor(private navParams: NavParams, private viewCtrl: ViewController,
        private vendorPro: VendorProvider, private userPro: UserProvider,
        private toast: ToastProvider
    ) {
        console.log('Hello SetupComponent Component');
        this.socialData = this.navParams.get('user');
        this.user.name = this.socialData.name;
        this.user.userName = this.socialData.userName;
        this.user.mobile = this.socialData.mobile;
        this.user.age = this.socialData.age;
        this.user.picture = this.socialData.picture;
        if (!this.user.mobile) {
            this.mobile = '(767)';
        } else {
            this.mobile = this.user.mobile;
        }
    }

    save() {
        this.user.type = this.isVendor ? 2 : 3;
        this.user.isActive = false;
        this.user.sex = 'male';
        this.user.mobile = this.mobile.replace(/\D+/g, '');
        if (this.user.name && this.user.userName && this.user.mobile) {
            this.vendorPro.addVendor(this.user).then(res => {
                if (res['success']) {
                    let user = res['data'];
                    user.isSocial = true;
                    this.userPro.setUser(user);
                    this.toast.presentToast(`Welcome ${user.name}`, 'toastSuccess');
                    this.viewCtrl.dismiss();
                }
            }).catch(err => {
                this.toast.presentToast('All Fields are not filed.', 'toastError');
            });
        }
    }

}
