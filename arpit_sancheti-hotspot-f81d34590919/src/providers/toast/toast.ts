import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello ToastProvider Provider');
  }

  presentToast(msg, cssClass) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: cssClass,
      dismissOnPageChange: false
    });
    toast.present();
  }

}
