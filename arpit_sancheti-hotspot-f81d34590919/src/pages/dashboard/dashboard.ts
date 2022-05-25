import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { VoucherProvider } from '../../providers/voucher/voucher';
import moment from 'moment';
import { VendorListPage } from '../vendor-list/vendor-list';
import { VoucherPage } from '../voucher/voucher';
import { AdminHomePage } from '../admin-home/admin-home';
import { HomePage } from '../home/home';
import { AddWalletPage } from '../add-wallet/add-wallet';
import { ClientHomePage } from '../client-home/client-home';
import { WalletProvider } from '../../providers/wallet/wallet';
import { VendorProvider } from '../../providers/vendor/vendor';
import { PlansProvider } from '../../providers/plans/plans';
import { EditPlanPage } from '../edit-plan/edit-plan';
import { ViewVendorPage } from '../view-vendor/view-vendor';
import { TransferVoucherPage } from '../transfer-voucher/transfer-voucher';
import { Clipboard } from '@ionic-native/clipboard';
import { CouponProvider } from '../../providers/coupon/coupon';
import { AddCouponPage } from '../add-coupon/add-coupon';
import { CouponsPage } from '../coupons/coupons';
import { BannerProvider } from '../../providers/banner/banner';
import { BannerPage } from '../banner/banner';
import { AddBannerPage } from '../add-banner/add-banner';
import { server } from '../../models/enum';
import { AddPlansPage } from '../add-plans/add-plans';
import { WalletTransferPage } from '../wallet-transfer/wallet-transfer';
import { ClientListingPage } from '../client-listing/client-listing';
import { ViewClientPage } from '../view-client/view-client';
import { HttpClient } from '@angular/common/http';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    task: any;
    user: any = {};
    vouchersLabel = [];
    voucherData = [
        { data: [], label: 'Vouchers Cost' },
        { data: [], label: 'Vouchers Sold' }
    ];
    walletBalance: number = 0;
    showVoucherChart = false;
    lineChartOptions: any = {
        responsive: true,
        fill: false,
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series',
                time: {
                    minUnit: 'day',
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }]
        }
    };

    couponCount: number = 0;
    totalVouchers: number = 0;
    vouchers: Array<any> = [];

    totalVendors: number = 0;
    vendors: Array<any> = [];
    totalClients: number = 0;
    clients: Array<any> = [];

    totalPlans: number = 0;
    plans: Array<any> = [];

    totalCost: number = 0;
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    coupons: Array<any> = [];
    banners: Array<any> = [];
    imageUrl: string = server + 'banners/';

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private userPro: UserProvider, private voucherPro: VoucherProvider,
        private walletPro: WalletProvider, private vendorPro: VendorProvider,
        private plansPro: PlansProvider, private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController, private platform: Platform,
        private clipboard: Clipboard, private couponPro: CouponProvider,
        private bannersPro: BannerProvider, private http: HttpClient,
        private toast: ToastProvider
    ) {

    }

    ionViewWillUnload() {
        clearInterval(this.task);
    }

    getBalance() {
        this.walletPro.getBalance(this.user.wallet)
            .then(res => {
                if (res['success']) {
                    this.walletBalance = res['data'];
                }
            });
    }

    voucherGraph(vouchers) {
        this.showVoucherChart = false;
        this.totalCost = 0;
        this.totalVouchers = 0;
        if (vouchers.length > 0) {
            //this.vouchersLabel = this.enumerateDaysBetweenDates(vouchers[0].createdAt, new Date());
            vouchers.forEach(voucher => {
                if (this.totalVouchers < 3) this.vouchers.push(voucher);
                /* let time = moment(voucher.createdAt).format('YYYY-MM-DD');
                let index = this.vouchersLabel.indexOf(time);
                this.voucherData[0].data[index] += voucher._plan.price;
                this.voucherData[1].data[index]++; */
                this.totalVouchers++;
                this.totalCost += voucher._plan.price;
            });
            this.showVoucherChart = true;
        }
    }

    vendorListing(vendors) {
        this.totalVendors = vendors.length;
        this.vendors = vendors.slice(0, 3);
    }

    clientsListing(clients) {
        this.totalClients = clients.length;
        this.clients = clients.slice(0, 3);
    }

    planListing(plans) {
        this.totalPlans = plans.length;
        this.plans = plans.slice(0, 3);
    }

    viewCoupons() {
        this.navCtrl.push(CouponsPage);
    }

    addCoupon() {
        this.navCtrl.push(AddCouponPage)
    }

    addPlans() {
        this.navCtrl.push(AddPlansPage)
    }

    ionViewCanEnter() {
        console.log('ionViewDidLoad DashboardPage');
        this.bannersPro.getBanners().then(res => this.banners = res['data']);
        this.userPro.activeUser.subscribe(user => {
            this.user = user;
            this.vouchers = [];
            this.totalCost = 0;
            this.totalVouchers = 0;
            this.vendors = [];
            this.clients = [];

            this.plans = [];
            this.totalPlans = 0;
            this.totalVendors = 0;
            this.getDetails();
        });
    }

    doRefresh(event) {
        let user = this.user;
        if (user.type == 1) {
            this.voucherPro.getVouchers()
                .then(res => this.voucherGraph(res['data']))
                .then(() => this.vendorPro.getVendors())
                .then(res => this.vendorListing(res['data']))
                .then(() => this.vendorPro.getClients())
                .then(res => this.clientsListing(res['data']))
                .then(() => this.plansPro.getPlans())
                .then(res => this.planListing(res['data']))
                .then(() => this.couponPro.getAll())
                .then(res => {
                    this.couponCount = res['data'].length;
                    this.coupons = res['data'].slice(0, 3);
                })
                .then(() => event.complete());
        } else if (user.type == 2) {
            this.voucherPro.getVendorVoucher(user._id)
                .then(res => {
                    this.voucherGraph(res['data']);
                    event.complete();
                });
        } else {
            this.voucherPro.getUserVoucher(user._id)
                .then(res => {
                    this.voucherGraph(res['data'])
                    event.complete();
                });
        }
    }

    getDetails() {
        let user = this.user;
        if (user.type == 1) {
            this.voucherPro.getVouchers()
                .then(res => this.voucherGraph(res['data']));
            this.vendorPro.getVendors()
                .then(res => this.vendorListing(res['data']));
            this.vendorPro.getClients()
                .then(res => this.clientsListing(res['data']));
            this.plansPro.getPlans()
                .then(res => this.planListing(res['data']));
            this.couponPro.getAll()
                .then(res => {
                    this.couponCount = res['data'].length;
                    this.coupons = res['data'].slice(0, 3);
                });
        } else if (user.type == 2) {
            this.task = setInterval(() => { this.getBalance() }, 10000);
            this.voucherPro.getVendorVoucher(user._id)
                .then(res => this.voucherGraph(res['data']));
        } else {
            this.task = setInterval(() => { this.getBalance() }, 10000);
            this.voucherPro.getUserVoucher(user._id)
                .then(res => this.voucherGraph(res['data']));
        }
    }

    loadVendors() {
        this.vendorPro.getVendors()
            .then(res => this.vendorListing(res['data']));
    }

    loadPlans() {
        this.plansPro.getPlans()
            .then(res => this.planListing(res['data']));
    }

    enumerateDaysBetweenDates(startDate, endDate) {
        var dates = [];

        var currDate = moment(startDate);
        var lastDate = moment(endDate);
        dates.push(currDate.clone().format('YYYY-MM-DD'));
        this.voucherData[0].data.push(0);
        this.voucherData[1].data.push(0);
        while (currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(currDate.clone().format('YYYY-MM-DD'));
            this.voucherData[0].data.push(0);
            this.voucherData[1].data.push(0);
        }
        dates.push(currDate.clone().format('YYYY-MM-DD'));
        this.voucherData[0].data.push(0);
        this.voucherData[1].data.push(0);

        return dates;
    };

    viewVendors() {
        this.navCtrl.push(VendorListPage);
    }

    viewVouchers() {
        this.navCtrl.push(VoucherPage);
    }

    viewPlans() {
        this.navCtrl.push(AdminHomePage);
    }

    viewClients() {
        this.navCtrl.push(ClientListingPage);
    }

    sellVoucher() {
        this.navCtrl.push(ClientHomePage);
    }

    buyVoucher() {
        this.navCtrl.push(HomePage);
    }

    addBalance() {
        this.navCtrl.push(AddWalletPage);
    }

    sendMoney() {
        this.navCtrl.push(WalletTransferPage);
    }

    viewBanners() {
        this.navCtrl.push(BannerPage);
    }

    addBanner() {
        this.navCtrl.push(AddBannerPage);
    }

    showVoucherActionSheet(voucher) {
        let actionSheet = undefined;
        if (this.user.type != 1 && (!voucher._user || voucher._user._id == this.user._id) && !voucher._mobile) {
            actionSheet = this.actionSheetCtrl.create({
                title: voucher.id,
                subTitle: 'What you want to do with this voucher?',
                cssClass: 'voucherSheet',
                buttons: [
                    {
                        text: 'Transfer Voucher',
                        handler: () => {
                            this.navCtrl.push(TransferVoucherPage, {
                                voucherCode: voucher.id,
                                new: false,
                                voucher: voucher
                            });
                        }
                    },
                    {
                        text: 'Activate Voucher',
                        handler: () => {
                            if (!this.platform.is('core')) this.clipboard.copy(voucher.id);
                            window.open('http://scan2log.in/?voucher=' + voucher.id, '_system')
                        }
                    },
                    {
                        text: 'Copy Voucher Code',
                        handler: () => {
                            if (!this.platform.is('core')) this.clipboard.copy(voucher.id);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
        } else {
            actionSheet = this.actionSheetCtrl.create({
                title: voucher.id,
                subTitle: 'You have already transfered this voucher',
                cssClass: 'voucherSheet',
                buttons: [
                    {
                        text: 'Add Voucher',
                        handler: () => {
                            if (this.user.type == 2)
                                this.navCtrl.push(ClientHomePage);
                            else if (this.user.type == 3)
                                this.navCtrl.push(HomePage);
                            else
                                '';
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
        }
        actionSheet.present();
    }

    showPlanActionSheet(plan) {
        let actionSheet = this.actionSheetCtrl.create({
            title: plan.plan_name,
            buttons: [
                {
                    text: 'Edit Plan',
                    handler: () => {
                        this.navCtrl.push(EditPlanPage, { plan })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    showVendorActionSheet(vendor) {
        let actionSheet = this.actionSheetCtrl.create({
            title: vendor.name,
            buttons: [
                {
                    text: vendor.isActive ? 'Inactivate Vendor' : 'Activate Vendor',
                    icon: vendor.isActive ? 'close-circle' : 'checkmark-circle-outline',
                    handler: () => {
                        vendor.isActive = !vendor.isActive;
                        this.vendorPro.editVendor(vendor).then(res => this.loadVendors());
                    }
                },
                {
                    text: 'Change to Client',
                    icon: 'checkmark-circle-outline',
                    handler: () => {
                        vendor.type = 3;
                        this.vendorPro.editVendor(vendor);
                        this.vendorPro.getVendors()
                            .then(res => this.vendorListing(res['data']));
                    }
                },
                {
                    text: 'Edit Vendor',
                    icon: 'create',
                    handler: () => {
                        this.navCtrl.push(ViewVendorPage, { vendor, edit: true });
                    }
                },
                {
                    text: 'Add Money',
                    icon: 'add',
                    handler: () => {
                        let alert = this.alertCtrl.create({
                            title: 'Add Money',
                            message: "Enter amount you need to add ($).",
                            inputs: [
                                {
                                    name: 'amount',
                                    placeholder: 'Amount',
                                    type: 'number'
                                },
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: data => {
                                        console.log('canceled');
                                    }
                                },
                                {
                                    text: 'Add',
                                    handler: data => {
                                        this.vendorPro.addBalance(vendor._id, data.amount);
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                },
                {
                    text: 'Send forgetPassword link',
                    handler: () => {
                        console.log('Send clicked');
                        this.http.put(server + 'forgetPassword', {
                            username: vendor.userName
                        }).toPromise().then(res => {
                            this.toast.presentToast('Email was sended successfully', 'dark-trans');
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    showClientActionSheet(client) {
        let actionSheet = this.actionSheetCtrl.create({
            title: client.name,
            buttons: [
                {
                    text: 'Edit Client',
                    icon: 'create',
                    handler: () => {
                        this.navCtrl.push(ViewClientPage, { vendor: client, edit: true });
                    }
                },
                {
                    text: 'Change to Vendor',
                    icon: 'checkmark-circle-outline',
                    handler: () => {
                        client.type = 2;
                        this.vendorPro.editVendor(client);
                        this.vendorPro.getClients()
                            .then(res => this.clientsListing(res['data']));
                    }
                },
                {
                    text: 'Add Money',
                    icon: 'add',
                    handler: () => {
                        let alert = this.alertCtrl.create({
                            title: 'Add Money',
                            message: "Enter amount you need to add ($).",
                            inputs: [
                                {
                                    name: 'amount',
                                    placeholder: 'Amount',
                                    type: 'number'
                                },
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: data => {
                                        console.log('canceled');
                                    }
                                },
                                {
                                    text: 'Add',
                                    handler: data => {
                                        this.vendorPro.addBalance(client._id, data.amount);
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                },
                {
                    text: 'Send forgetPassword link',
                    handler: () => {
                        console.log('Send clicked');
                        this.http.put(server + 'forgetPassword', {
                            username: client.userName
                        }).toPromise().then(res => {
                            this.toast.presentToast('Email was sended successfully', 'dark-trans');
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    viewCoupon(coupon) {
        this.navCtrl.push(AddCouponPage, { coupon })
    }

}
