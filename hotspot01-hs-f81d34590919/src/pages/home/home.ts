import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { StripeJavaScriptPage } from '../stripe-java-script/stripe-java-script';
import { PlanModule } from '../../models/plan';
import { PlansProvider } from '../../providers/plans/plans';
import { UserProvider } from '../../providers/user/user';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    myPlans: Array<PlanModule> = [];
    selectedPlan: PlanModule;

    constructor(public navCtrl: NavController, private userPro: UserProvider,
        public toastCtrl: ToastController, private plans: PlansProvider) {

    }

    ionViewWillEnter() {
        this.plans.getPlans().then(data => {
            this.myPlans = data['data'];
        })
    }

    pay() {
        this.navCtrl.push(StripeJavaScriptPage, { plan: this.selectedPlan });
    }

    select(plan: PlanModule) {
        this.selectedPlan = plan;
    }

    presentToast(msg, cssClass) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            cssClass: cssClass,
            dismissOnPageChange: true
        });
        toast.present();
    }

}
