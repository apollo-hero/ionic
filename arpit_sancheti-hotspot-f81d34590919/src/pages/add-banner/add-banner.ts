import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BannerProvider } from '../../providers/banner/banner';

/**
 * Generated class for the AddBannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-banner',
  templateUrl: 'add-banner.html',
})
export class AddBannerPage {

  imageURI: any;
  imageFileName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private transfer: FileTransfer, private bannerPro: BannerProvider,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBannerPage');
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      this.imageFileName = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    this.bannerPro.addBanner({
      image: this.imageFileName,
      url: ''
    }).then(data => {
      loader.dismiss();
      this.navCtrl.pop()
    })
      .catch(err => {
        loader.dismiss();
        console.error(JSON.stringify(err));
      });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
