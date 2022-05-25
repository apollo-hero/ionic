import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { AddClientPage } from '../add-client/add-client';
import { ViewClientPage } from '../view-client/view-client';
import { server } from '../../models/enum';
import { HttpClient } from '@angular/common/http';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the ClientListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-client-listing',
    templateUrl: 'client-listing.html',
})
export class ClientListingPage {

    vendors: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private vendorPro: VendorProvider, private alertCtrl: AlertController,
        private actionSheetCtrl: ActionSheetController, private http: HttpClient,
        private toast: ToastProvider) {
    }

    ionViewWillEnter() {
        this.loadVendors();
    }

    loadVendors() {
        this.vendorPro.getClients().then(data => {
            this.vendors = data['data'];
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VendorListPage');
    }

    addNew() {
        this.navCtrl.push(AddClientPage);
    }

    showVendorActionSheet(vendor) {
        let actionSheet = this.actionSheetCtrl.create({
            title: vendor.name,
            buttons: [
                {
                    text: 'Edit Client',
                    icon: 'create',
                    handler: () => {
                        this.navCtrl.push(ViewClientPage, { vendor, edit: true });
                    }
                },
                {
                    text: 'Change to Vendor',
                    icon: 'checkmark-circle-outline',
                    handler: () => {
                        vendor.type = 2;
                        this.vendorPro.editVendor(vendor);
                        this.navCtrl.popToRoot();
                    }
                },
                {
                    text: 'Add Money',
                    icon: 'add',
                    handler: () => {
                        let alert = this.alertCtrl.create({
                            title: 'Add Money',
                            message: "Enter amount you need to add ($).",
                            inputs: [
                                {
                                    name: 'amount',
                                    placeholder: 'Amount',
                                    type: 'number'
                                },
                            ],
                            buttons: [
                                {
                                    text: 'Cancel',
                                    handler: data => {
                                        console.log('canceled');
                                    }
                                },
                                {
                                    text: 'Add',
                                    handler: data => {
                                        this.vendorPro.addBalance(vendor._id, data.amount);
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                },
                {
                    text: 'Send forgetPassword link',
                    handler: () => {
                        console.log('Send clicked');
                        this.http.put(server + 'forgetPassword', {
                            username: vendor.userName
                        }).toPromise().then(res => {
                            this.toast.presentToast('Email was sended successfully', 'dark-trans');
                        });
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
