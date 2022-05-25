import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AddVendorPage } from '../add-vendor/add-vendor';
import { ViewVendorPage } from '../view-vendor/view-vendor';
import { VendorProvider } from '../../providers/vendor/vendor';
import { HttpClient } from '@angular/common/http';
import { ToastProvider } from '../../providers/toast/toast';
import { server } from '../../models/enum';

/**
 * Generated class for the VendorListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-vendor-list',
    templateUrl: 'vendor-list.html',
})
export class VendorListPage {
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
        this.vendorPro.getVendors().then(data => {
            this.vendors = data['data'];
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VendorListPage');
    }

    addNew() {
        this.navCtrl.push(AddVendorPage);
    }

    showVendorActionSheet(vendor) {
        let actionSheet = this.actionSheetCtrl.create({
            title: vendor.name,
            buttons: [
                {
                    text: vendor.isActive ? 'Inactivate Vendor' : 'Activate Vendor',
                    icon: vendor.isActive ? 'close-circle' : 'checkmark-circle-outline',
                    handler: () => {
                        vendor.isActive = !vendor.isActive;
                        this.vendorPro.editVendor(vendor).then(res => this.loadVendors());
                    }
                },
                {
                    text: 'Change to Client',
                    icon: 'checkmark-circle-outline',
                    handler: () => {
                        vendor.type = 3;
                        this.vendorPro.editVendor(vendor);
                        this.navCtrl.popToRoot();
                    }
                },
                {
                    text: 'Edit Vendor',
                    icon: 'create',
                    handler: () => {
                        this.navCtrl.push(ViewVendorPage, { vendor, edit: true });
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
