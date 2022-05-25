import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlanModule } from '../../models/plan';
import { PlansProvider } from '../../providers/plans/plans';
import { ToastProvider } from '../../providers/toast/toast';
import { CurrencyType } from '../../models/enum';

/**
 * Generated class for the AddPlansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-plans',
  templateUrl: 'add-plans.html',
})
export class AddPlansPage {
  plan: PlanModule = new PlanModule();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private planPro: PlansProvider, private toastPro: ToastProvider) {
    this.plan.duration_type = 3;
    this.plan.currency = CurrencyType.XCD;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlansPage');
  }

  create() {
    this.planPro.addPlan(this.plan)
      .then(res => {
        console.log(res);
        if (res['success']) {
          this.toastPro.presentToast('Plan Added Succesfully', 'toastSuccess');
          this.navCtrl.pop();
        } else {
          this.toastPro.presentToast(res['msg'], 'toastError');
        }
      })
      .catch((err) => { console.log(JSON.stringify(err)); this.toastPro.presentToast('Api not active', 'toastError'); });
  }

}
