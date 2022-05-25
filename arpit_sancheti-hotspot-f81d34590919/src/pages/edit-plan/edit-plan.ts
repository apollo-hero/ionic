import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlansProvider } from '../../providers/plans/plans';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the EditPlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-plan',
  templateUrl: 'edit-plan.html',
})
export class EditPlanPage {

  plan: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private planPro: PlansProvider, private toastPro: ToastProvider) {
    /* this.plan.duration_type = 3;
    this.plan.currency = CurrencyType.XCD; */
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlansPage');
  }

  create() {
    this.planPro.editPlan(this.plan)
      .then(res => {
        console.log(res);
        if (res['success']) {
          this.toastPro.presentToast('Plan Edited Succesfully', 'toastSuccess');
          this.navCtrl.pop();
        } else {
          this.toastPro.presentToast(res['msg'], 'toastError');
        }
      })
      .catch((err) => { console.log(JSON.stringify(err)); this.toastPro.presentToast('Api not active', 'toastError'); });
  }

  delete() {
    this.planPro.deletePlan(this.plan._id)
      .then(res => {
        console.log(res);
        if (res['success']) {
          this.toastPro.presentToast('Plan Deleted Succesfully', 'toastSuccess');
          this.navCtrl.pop();
        } else {
          this.toastPro.presentToast(res['msg'], 'toastError');
        }
      })
      .catch((err) => { console.log(JSON.stringify(err)); this.toastPro.presentToast('Api not active', 'toastError'); });
  }

}
