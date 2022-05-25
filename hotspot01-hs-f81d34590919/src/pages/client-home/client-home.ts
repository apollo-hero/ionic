import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { PlansProvider } from '../../providers/plans/plans';
import { UserAutoCompleteProvider } from '../../providers/user-auto-complete/user-auto-complete';
import { PlansAutoCompleteProvider } from '../../providers/plans-auto-complete/plans-auto-complete';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { StripeJavaScriptPage } from '../stripe-java-script/stripe-java-script';

/**
 * Generated class for the ClientHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-client-home',
    templateUrl: 'client-home.html',
})
export class ClientHomePage {

    clients: any[];
    plans: any[];

    planSelected: any;
    mobile: string = '(767)';
    userSelected: any;

    @ViewChild('selectedUser')
    selectedUser: AutoCompleteComponent;
    @ViewChild('selectedPlan')
    selectedPlan: AutoCompleteComponent;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public clientsPro: UserAutoCompleteProvider, public plansAuto: PlansAutoCompleteProvider,
        private vendorPro: VendorProvider, private planPro: PlansProvider) {
        this.vendorPro.getVendors().then(res => this.clients = res['data']);
        this.planPro.getPlans().then(res => this.plans = res['data']);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ClientHomePage');
    }

    ionViewWillEnter() {
        this.planSelected = undefined;
        this.userSelected = undefined;
        this.mobile = '(767)';
    }

    pay() {
        if (this.userSelected['name']) {
            this.navCtrl.push(StripeJavaScriptPage, {
                plan: this.planSelected,
                _user: this.userSelected
            });
        } else {
            this.navCtrl.push(StripeJavaScriptPage, {
                plan: this.planSelected,
                _user: {
                    mobile: this.userSelected['mobile']
                },
                mobile: this.userSelected['mobile']
            });
        }
    }

    selectPlan(plan) {
        this.planSelected = plan;
    }

    unSelectPlan() {
        this.planSelected = undefined;
    }

    unSelectUser() {
        this.userSelected = undefined;
    }

    search() {
        let mobile = this.mobile.replace(/\D+/g, '');
        this.vendorPro.searchUser(mobile).then(res => {
            if (res['success']) {
                if (res['data']) {
                    this.userSelected = res['data'];
                } else {
                    this.userSelected = {
                        mobile
                    };
                }
            }
        })
    }

}
