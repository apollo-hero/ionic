import { AddBannerPage } from './../add-banner/add-banner';
import { BannerProvider } from './../../providers/banner/banner';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { server } from '../../models/enum';

/**
 * Generated class for the BannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-banner',
  templateUrl: 'banner.html',
})
export class BannerPage {

  banners: Array<any> = [];
  imageUrl: string = server + 'banners/';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public bannersPro: BannerProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BannerPage');
  }

  ionViewWillEnter() {
    this.bannersPro.getBanners().then(res => this.banners = res['data']);
  }

  delete(banner) {
    banner.active = false;
    this.bannersPro.editBanner(banner).then(() => this.ionViewWillEnter());
  }

  addNew() {
    this.navCtrl.push(AddBannerPage);
  }

}
