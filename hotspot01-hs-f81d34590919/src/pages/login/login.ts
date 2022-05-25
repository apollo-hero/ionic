import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';

import { ToastProvider } from '../../providers/toast/toast';
import { RegisterPage } from '../register/register';
import { UserProvider } from '../../providers/user/user';
import { server } from '../../models/enum';
import { VendorProvider } from '../../providers/vendor/vendor';
import { SetupComponent } from '../../components/setup/setup';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    password: string;
    username: string;
    error = {
        username: false,
        password: false
    }

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private http: HttpClient, private toast: ToastProvider,
        private modalCtrl: ModalController,
        private vendorPro: VendorProvider, private forgotCtrl: AlertController,
        private userPro: UserProvider, private fb: Facebook,
        private twitter: TwitterConnect, private gPlus: GooglePlus
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    register() {
        this.navCtrl.setRoot(RegisterPage);
    }

    forgotPass() {
        let forgot = this.forgotCtrl.create({
            title: 'Forgot Password?',
            message: "Enter you email address to send a reset link password.",
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Email',
                    type: 'email'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Send',
                    handler: data => {
                        console.log('Send clicked');
                        this.http.put(server + 'forgetPassword', {
                            username: data.email
                        }).toPromise().then(res => {
                            this.toast.presentToast('Email was sended successfully', 'dark-trans');
                        });
                    }
                }
            ]
        });
        forgot.present();
    }

    login() {
        this.error.username = !this.username;
        this.error.password = !this.password;
        if (!this.error.username && !this.error.password) {
            this.http.put(server + 'login', {
                username: this.username,
                password: this.password
            }).toPromise().then(res => {
                let data: any = res;
                if (data.success) {
                    let user = data.data;
                    this.userPro.setUser(user);
                    this.toast.presentToast(`Welcome ${this.username}`, 'toastSuccess');
                } else {
                    this.toast.presentToast('Invalid Credential', 'toastError');
                }
            }).catch(err => {
                console.log(err);
                this.toast.presentToast(err.error.message, 'toastError');
            });
        }
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

    twitter_login() {
        this.twitter.login()
            .then((res: TwitterConnectResponse) => console.log('Logged into Twitter!', res))
            .catch(e => console.log('Error logging into Twitter', e));
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

}
