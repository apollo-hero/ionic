import { LoadingController, Loading } from 'ionic-angular';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {
  loader: Loading;

  constructor(public loadingCtrl: LoadingController) {
    console.log('Hello LoadingProvider Provider');
  }

  presentLoading(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismissAll();
  }

}
