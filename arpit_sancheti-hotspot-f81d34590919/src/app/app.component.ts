import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { VendorListPage } from '../pages/vendor-list/vendor-list';
import { VoucherPage } from '../pages/voucher/voucher';
import { UserType } from '../models/enum';
import { ProfilePage } from '../pages/profile/profile';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { TransactionPage } from '../pages/transaction/transaction';
import { UserProvider } from '../providers/user/user';
import { WalletProvider } from '../providers/wallet/wallet';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastProvider } from '../providers/toast/toast';
import { VendorProvider } from '../providers/vendor/vendor';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;
    @ViewChild(Nav) nav: Nav;
    user: any;
    task: any;
    balance: number;
    counter: number = 0;

    alert: any;
    pages: Array<{ title: string, component: any, type: string, icon: string }>

    constructor(platform: Platform, statusBar: StatusBar,
        splashScreen: SplashScreen, private storage: Storage,
        private menuCtrl: MenuController, private alertCtrl: AlertController,
        private userPro: UserProvider, private walletPro: WalletProvider,
        private social: SocialSharing, private toaster: ToastProvider,
        private vendorPro: VendorProvider, private push: Push
    ) {

        this.pages = [
            { title: 'Dashboard', component: DashboardPage, type: null, icon: 'apps' },
            { title: 'Profile', component: ProfilePage, type: null, icon: 'person' },
            { title: 'Vendors', component: VendorListPage, type: UserType.ADMIN, icon: 'contacts' },
            { title: 'Vouchers', component: VoucherPage, type: UserType.ADMIN, icon: 'pricetags' },
            /* { title: 'Clients', component: VendorListPage, type: UserType.VENDOR }, */
            { title: 'Vouchers', component: VoucherPage, type: UserType.VENDOR, icon: 'pricetags' },
            { title: 'Transactions', component: TransactionPage, type: UserType.VENDOR, icon: 'repeat' },
            { title: 'Vouchers', component: VoucherPage, type: UserType.CLIENT, icon: 'pricetags' },
            { title: 'Transactions', component: TransactionPage, type: UserType.CLIENT, icon: 'repeat' },
            { title: 'Contact Us', component: ContactUsPage, type: null, icon: 'information' },
            { title: 'Share', component: null, type: null, icon: 'share' }
        ];
        platform.ready().then(() => {
            this.disableAllMenu();

            this.push.hasPermission()
                .then((res: any) => {

                    if (res.isEnabled) {
                        console.log('We have permission to send push notifications');
                    } else {
                        console.log('We do not have permission to send push notifications');
                    }

                });
            this.push.createChannel({
                id: "testchannel1",
                description: "My first test channel",
                // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
                importance: 5
            }).then(() => console.log('Channel created'));

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.userPro.activeUser.subscribe(user => {
                if (user) {
                    this.user = user;
                    switch (user.type) {
                        case 1:
                        case '1':
                            this.menuCtrl.enable(true, 'admin');
                            this.rootPage = DashboardPage;
                            break;
                        case 2:
                        case '2':
                            this.menuCtrl.enable(true, 'admin');
                            //this.task = setInterval(() => { this.getBalance() }, 10000);
                            this.rootPage = DashboardPage;
                            break;
                        case 3:
                        case '3':
                            this.menuCtrl.enable(true, 'admin');
                            //this.task = setInterval(() => { this.getBalance() }, 10000);
                            this.rootPage = DashboardPage;
                            break;
                        default:
                            this.disableAllMenu();
                            //this.task = setInterval(() => { this.getBalance() }, 10000);
                            this.rootPage = LoginPage;
                            break;
                    }
                } else {
                    this.disableAllMenu();
                    clearInterval(this.task);
                    this.rootPage = LoginPage;
                }

                const options: PushOptions = {
                    android: {
                        forceShow: true,
                        sound: true,
                        icon: "logo",
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    },
                    windows: {},
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    }
                };
                const pushObject: PushObject = this.push.init(options);

                pushObject.on('registration').subscribe((registration: any) => {
                    console.log('Device registered', registration);
                    this.vendorPro.registerToken(registration.registrationId, this.user);
                });

                pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
                pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
                statusBar.styleDefault();
                splashScreen.hide();
            });

            platform.registerBackButtonAction(() => {
                if (this.nav.canGoBack()) { //Can we go back?
                    this.nav.pop();
                    this.counter = 0;
                } else if (this.counter == 0) {
                    this.counter++;
                    this.toaster.presentToast('Press again to go to desktop', 'toastInfo');
                    setTimeout(() => {
                        this.counter = 0;
                    }, 2000);
                } else {
                    this.counter = 0;
                    platform.exitApp();
                }
            });
        });
    }

    disableAllMenu() {
        this.menuCtrl.enable(false, 'admin');
        this.menuCtrl.enable(false, 'vendor');
        this.menuCtrl.enable(false, 'client');
    }

    openPage(page) {
        if (page.title == 'Share') {
            /* let shareModal = this.share.create(ShareComponent);
            shareModal.present(); */
            this.social.share("Use this app for Internet Access via EPICNET'S HotSpots.", 'EPIC HOTSPOT', 'http://epic.dm/wp-content/uploads/2016/09/Epic.png', 'https://play.google.com/store/apps/details?id=com.hotspot.epicnet')
        } else {
            // Reset the content nav to have just this page
            // we wouldn't want the back button to show in this scenario
            this.nav.setRoot(page.component);
        }
    }

    getBalance() {
        this.walletPro.getBalance(this.user.wallet)
            .then(res => {
                if (res['success']) {
                    this.balance = res['data'];
                }
            });
    }

    logout() {
        this.storage.remove('user');
        this.userPro.activeUser.next(null);
        this.disableAllMenu();
        this.nav.setRoot(LoginPage);
    }

    editProfile() {
        this.nav.push(ProfilePage);
    }
}

