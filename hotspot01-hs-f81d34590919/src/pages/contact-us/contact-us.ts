import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-contact-us',
    templateUrl: 'contact-us.html',
})
export class ContactUsPage {
    appVer: string = "";
    s: HTMLScriptElement;
    h: HTMLScriptElement;
    constructor(public navCtrl: NavController, public navParams: NavParams,
        private appVersion: AppVersion) {
        //this.appVersion.getVersionNumber().then(val => this.appVer = val);
    }

    ionViewDidLoad() {
        /*console.log('ionViewDidLoad ContactUsPage');
        let u = 'https://cdn.bitrix24.com/b7136119/crm/site_button/loader_1_75ibq6.js';
        let w = window;
        let d = document;
        this.s = d.createElement('script');
        this.s.async = true;
        this.s.src = u + '?' + (Date.now() / 60000 | 0);
        this.h = d.getElementsByTagName('script')[0];
        console.log(this.h, this.s);
        this.h.parentNode.insertBefore(this.s, this.h);*/
    }

    ionViewDidLeave() {
        /*console.log('ionViewDidLeave ContactUsPage');
        document.getElementsByClassName('b24-widget-button-shadow')[0].parentElement.remove();
        this.h.remove();*/
    }


}
