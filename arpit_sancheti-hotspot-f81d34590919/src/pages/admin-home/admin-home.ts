import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { PlansProvider } from '../../providers/plans/plans';
import { PlanModule } from '../../models/plan';
import { AddPlansPage } from '../add-plans/add-plans';
import { EditPlanPage } from '../edit-plan/edit-plan';

/**
 * Generated class for the AdminHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {

  myPlans: Array<PlanModule> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private plans: PlansProvider, private actionSheetCtrl: ActionSheetController) {
  }

  ionViewWillEnter() {
    this.plans.getPlans().then(data => {
      this.myPlans = data['data'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  addNew() {
    this.navCtrl.push(AddPlansPage);
  }

  edit(plan) {
    this.navCtrl.push(EditPlanPage, { plan });
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

}
