import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanModule } from '../../models/plan';
import { LoadingProvider } from '../../providers/loading/loading';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { Voucher } from '../../models/voucher';
import { VoucherPage } from '../voucher/voucher';
import { WalletProvider } from '../../providers/wallet/wallet';
import { TransferVoucherPage } from '../transfer-voucher/transfer-voucher';
import { stripeKey, server } from '../../models/enum';
import { CouponProvider } from '../../providers/coupon/coupon';

declare var Stripe;

@Component({
    selector: 'page-stripe-java-script',
    templateUrl: 'stripe-java-script.html',
})
export class StripeJavaScriptPage {

    stripe = Stripe(stripeKey);
    card: any;
    balance: number = 0;
    cardOnly: boolean = true;
    payReq: boolean = false;
    error: boolean = false;
    user: any = {};
    userGroup: FormGroup;
    amount: number = 25;
    plan: PlanModule;
    errorMessages: Array<string> = [];
    _user: any = {};
    couponCode: string;
    couponRes: string;
    discount: number = 0;
    isNewUser: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public http: Http, private userPro: UserProvider,
        private formBuilder: FormBuilder, private loader: LoadingProvider,
        private voucherPro: VoucherProvider, private wallet: WalletProvider,
        private alertCtrl: AlertController, private coupon: CouponProvider) {
        this.plan = this.navParams.get('plan');
        this._user = this.navParams.get('_user');
        this.isNewUser = this.navParams.get('isNew');
        this.amount = this.plan.price;
        this.userGroup = this.formBuilder.group({
            _id: [this.user._id, Validators.required],
            name: [this.user.name, Validators.required],
            email: [this.user.email, Validators.compose([
                Validators.required,
                Validators.email
            ])],
            phone: [this.user.phone, Validators.required]
        });
        this.userPro.activeUser.subscribe(user => {
            user.email = user.userName;
            user.phone = user.mobile;
            this.userGroup.patchValue(user);
        });
    }

    ionViewWillEnter() {
        this.loader.presentLoading('');
        this.userPro.activeUser.subscribe(user => {
            this.user = user;
            this.wallet.getBalance(this.user.wallet).then(res => {
                if (res['success']) {
                    this.balance = res['data'];
                    this.loader.dismissLoading();
                }
            });
        });
    }

    ionViewDidLoad() {
        console.log(this.user);
        this.setupStripe();
    }

    appyCoupon() {
        this.coupon.transCoupon(this.couponCode).then(
            res => {
                let coup = res['data'];
                if (coup.minAmount > this.amount) {
                    this.couponRes = 'This coupon can be applicable on transation amounting more than ' + coup.minAmount;
                    return;
                }
                if (coup.isAbs) {
                    this.discount = coup.value;
                    this.couponRes = undefined;
                } else {
                    this.discount = coup.value * this.amount / 100;
                    if (this.discount > coup.maxAmount) {
                        this.discount = coup.maxAmount
                    }
                }
                if (this.discount > this.amount) {
                    this.discount = this.amount
                }
                this.couponRes = 'Applied Successfully';
            }
        ).catch(err => {
            console.log(err.error.message);
            this.couponRes = err.error.message;
        })
    }

    setupStripe() {
        let elements = this.stripe.elements({
            fonts: [
                {
                    cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
                },
            ],
            // Stripe's examples are localized to specific languages, but if
            // you wish to have Elements automatically detect your user's locale,
            // use `locale: 'auto'` instead.
            locale: 'auto'
        });

        var style = {
            base: {
                color: '#222',
                iconColor: '#222',
                lineHeight: '24px',
                fontWeight: 400,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#ccc'
                },
                ':-webkit-autofill': {
                    color: '#333'
                }
            },
            invalid: {
                color: '#FFC7EE',
                iconColor: '#FFC7EE'
            }
        };

        this.card = elements.create('card', {
            iconStyle: 'solid',
            style: style
        });

        this.card.mount('#card-element');

        /**
         * Payment Request Element
         */
        var paymentRequest = this.stripe.paymentRequest({
            country: "US",
            currency: "xcd",
            total: {
                amount: 2500,
                label: "Total"
            },
            requestShipping: true,
            shippingOptions: [
                {
                    id: "free-shipping",
                    label: "Free shipping",
                    detail: "Arrives in 5 to 7 days",
                    amount: 0
                }
            ]
        });
        paymentRequest.on("token", function (result) {
            // request for payment on server
        });

        var paymentRequestElement = elements.create("paymentRequestButton", {
            paymentRequest: paymentRequest,
            style: {
                paymentRequestButton: {
                    theme: "light"
                }
            }
        });

        paymentRequest.canMakePayment().then(function (result) {
            if (result) {
                this.cardOnly = false;
                this.payReq = true;
                paymentRequestElement.mount("#example5-paymentRequest");
            }
        });

        this.card.addEventListener('change', event => {
            if (event.error) {
                this.error = true;
                this.errorMessages.push(event.error.message);
            } else {
                this.error = false;
                this.errorMessages = [];
            }
        });
    }

    submit() {
        if (!this.error) {
            this.loader.presentLoading('Paying...');
            let user = this.userGroup.value;
            let additionalData = {
                name: user.name,
                address_city: user.city,
                address_state: user.state,
                address_zip: user.zip,
            };
            this.stripe.createToken(this.card, additionalData).then(response => {
                if (response.error) {
                    this.error = true;
                    this.errorMessages.push(response.error.message);
                    this.loader.dismissLoading();
                } else {
                    var data = {
                        stripetoken: response.token,
                        amountpayable: this.amount - this.discount,
                        add: false,
                        userId: this.user._id,
                        discount: 0
                    };
                    var headers = new Headers();
                    headers.append('Conent-Type', 'application/json');
                    this.http.post(server + 'processpay', data, { headers: headers }).subscribe((res) => {
                        res = res.json();
                        if (res['success'])
                            this.voucherCreate();
                        else {
                            this.loader.dismissLoading();
                            this.error = true;
                            this.errorMessages.push(res['data']['code']);
                        }
                    })
                }
            });
        }
    }

    voucherCreate() {
        this.loader.presentLoading('Voucher...');
        let mobile = this.navParams.get('mobile');
        let voucher: any = new Voucher(this.plan);
        this.voucherPro.create(voucher).then(data => {
            let voucherId = data['data']['vouchers'][0];
            let _userId = this._user ? this._user._id : undefined;
            this.voucherPro.addVoucher(voucher, voucherId, this.discount, this.user._id, this.user.type, _userId, mobile).then(data => {
                this.loader.dismissLoading();
                /* this.navCtrl.setRoot(VoucherPage); */
                if (!_userId && !mobile) this.saveOrTransfer(voucherId, data['data']);
                else this.navCtrl.popToRoot();
            });
        })
    }

    saveOrTransfer(voucherCode, voucher) {
        let alert = this.alertCtrl.create({
            title: 'Next',
            message: 'What do you want to do with the voucher',
            buttons: [
                {
                    text: 'Save',
                    handler: () => {
                        this.navCtrl.setRoot(VoucherPage);
                    }
                }, {
                    text: 'Transfer',
                    handler: () => {
                        this.navCtrl.setRoot(TransferVoucherPage, {
                            voucherCode,
                            new: true,
                            voucher: voucher
                        });
                    }
                }
            ]
        });
        alert.present();
    }
}
