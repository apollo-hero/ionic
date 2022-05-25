import { CouponProvider } from './../../providers/coupon/coupon';
import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanModule } from '../../models/plan';
import { LoadingProvider } from '../../providers/loading/loading';
import { stripeKey, server } from '../../models/enum';

declare var Stripe;

@Component({
    selector: 'page-add-wallet',
    templateUrl: 'add-wallet.html',
})
export class AddWalletPage {

    stripe = Stripe(stripeKey);
    card: any;
    cardOnly: boolean = true;
    payReq: boolean = false;
    error: boolean = false;
    user: any = {};
    userGroup: FormGroup;
    amount: number;
    plan: PlanModule;
    errorMessages: Array<string> = [];

    couponCode: string;
    couponRes: string;
    discount: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public http: Http, private userPro: UserProvider, private coupon: CouponProvider,
        private formBuilder: FormBuilder, private loader: LoadingProvider) {
        this.userGroup = this.formBuilder.group({
            _id: [this.user._id, Validators.required],
            name: [this.user.name, Validators.required],
            email: [this.user.email, Validators.compose([
                Validators.required,
                Validators.email
            ])],
            phone: [this.user.phone, Validators.required],
            amount: [this.amount, Validators.compose([
                Validators.required,
                Validators.min(2),
                Validators.max(999999)]
            )]
        });
        this.userPro.activeUser.subscribe(user => {
            this.user = user;
            user.email = user.userName;
            user.phone = user.mobile;
            this.userGroup.patchValue(user);
        });
    }

    ionViewWillEnter() {

    }

    ionViewDidLoad() {
        console.log(this.user);
        this.setupStripe();
    }

    amountChanged() {
        if (this.couponCode != '') {
            this.appyCoupon();
        }
    }

    appyCoupon() {
        this.discount = 0;
        this.coupon.walletCoupon(this.couponCode).then(
            res => {
                let coup = res['data'];
                if (coup.minAmount > this.userGroup.value.amount) {
                    this.couponRes = 'This coupon can be applicable on transation amounting more than ' + coup.minAmount;
                    return;
                }
                if (coup.isAbs) {
                    this.discount = coup.value;
                    this.couponRes = undefined;
                } else {
                    this.discount = coup.value * this.userGroup.value.amount / 100;
                    if (this.discount > coup.maxAmount) {
                        this.discount = coup.maxAmount
                    }
                }
                if (this.discount > this.userGroup.value.amount) {
                    this.discount = this.userGroup.value.amount
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
            this.loader.presentLoading('Validating...');
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
                    this.loader.presentLoading('Paying...');
                    var data = {
                        stripetoken: response.token,
                        amountpayable: this.userGroup.value.amount - this.discount,
                        add: true,
                        userId: this.user._id,
                        discount: this.discount
                    };
                    var headers = new Headers();
                    headers.append('Conent-Type', 'application/json');
                    this.http.post(server + 'processpay', data, { headers: headers }).subscribe((res) => {
                        var result = res.json();
                        this.loader.dismissLoading();
                        if (result.success) {
                            this.navCtrl.pop();
                        } else {
                            this.error = true;
                            console.log(result.data);
                            this.errorMessages.push(result.data.message);
                        }
                    }, err => {

                    });
                }
            });
        }
    }
}
