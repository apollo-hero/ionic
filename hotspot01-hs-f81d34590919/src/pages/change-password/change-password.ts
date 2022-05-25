import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { UserProvider } from '../../providers/user/user';
import { ToastProvider } from "../../providers/toast/toast";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  user: any = {}
  password: string;
  oldPassword: string;
  confirmPassword: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private vendorPro: VendorProvider, private userPro: UserProvider,
    private toast: ToastProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
    this.userPro.activeUser.subscribe(user => this.user = user);
  }

  changePassword() {
    this.vendorPro.changePassword(this.user._id, {
      oldPassword: this.oldPassword,
      password: this.password
    }).then(res => {
      if (res['success']) {
        this.toast.presentToast('Password Changed Sucessfully', 'toastSuccess');
        this.navCtrl.pop();
      }
    }).catch(err => {
      this.toast.presentToast(err.error.message(), 'toastError');
    });
  }

}
