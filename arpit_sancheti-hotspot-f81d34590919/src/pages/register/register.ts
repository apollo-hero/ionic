import { Component } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { LoginPage } from "../login/login";
import { VendorProvider } from "../../providers/vendor/vendor";
import { ToastProvider } from "../../providers/toast/toast";
import { UserProvider } from "../../providers/user/user";

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { SetupComponent } from "../../components/setup/setup";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    user: any = {
        type: 2
    };

    mobile: string = '(767)';

    isVendor: boolean = false;

    constructor(public navCtrl: NavController, private vendorPro: VendorProvider,
        private toast: ToastProvider, private userPro: UserProvider,
        private modalCtrl: ModalController, private fb: Facebook,
        private twitter: TwitterConnect, private gPlus: GooglePlus
    ) {
    }

    numberChanged() {
        this.user.mobile = this.mobile.replace(/\D+/g, '');
    }

    isValidEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(this.user.userName).toLowerCase());
    }

    // register and go to home page
    register() {
        this.user.type = this.isVendor ? 2 : 3;
        this.user.isActive = false;
        this.user.mobile = this.mobile.replace(/\D+/g, '');
        this.user.sex = 'male';
        this.vendorPro.addVendor(this.user).then(res => {
            if (res['success']) {
                let user = res['data'];
                this.userPro.setUser(user);
                this.toast.presentToast(`Welcome ${user.name}`, 'toastSuccess');
            }
        }).catch(err => {
            this.toast.presentToast(err.error.message, 'toastError');
        });
    }

    // go to login page
    login() {
        this.navCtrl.setRoot(LoginPage);
    }

    fb_login() {
        this.fb.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => this.fb.api('me?fields=id,name,email,picture.width(720).height(720).as(picture)', []))
            .then(profile => {
                let email = encodeURIComponent(profile.email);
                let userData = {
                    name: profile.name,
                    userName: profile.email,
                    picture: profile.picture.data.url
                };
                this.checkForRegistered(email, userData);
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    gplus_login() {
        this.gPlus.login({})
            .then(res => {
                let email = encodeURIComponent(res.email);
                let userData = {
                    name: res.displayName,
                    userName: res.email,
                    picture: res.imageUrl
                };
                this.checkForRegistered(email, userData);
            })
            .catch(e => console.log('Error logging into GooglePlus', e));
    }

    checkForRegistered(email, userData) {
        this.vendorPro.getByUserName(email)
            .then(res => {
                if (res['success']) {
                    let user = res['data'];
                    user.isSocial = true;
                    user.picture = userData.picture;
                    this.userPro.setUser(user);
                    this.toast.presentToast(`Welcome ${user.name}`, 'toastSuccess');
                }
            })
            .catch(err => {
                if (err.status == 404) {
                    let modal = this.modalCtrl.create(SetupComponent, {
                        user: userData
                    });
                    modal.present();
                } else {
                    console.log(JSON.stringify(err));
                    this.toast.presentToast(err.error.message, 'toastError');
                }
            })
    }

}
