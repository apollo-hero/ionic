import { CouponConfirmationPage } from './../pages/coupon-confirmation/coupon-confirmation';
import { AddBannerPage } from './../pages/add-banner/add-banner';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Clipboard } from '@ionic-native/clipboard';
import { Stripe } from '@ionic-native/stripe';
import { AppRate } from '@ionic-native/app-rate';

//social
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { SocialSharing } from '@ionic-native/social-sharing';

// payment
import { NgxStripeModule } from 'ngx-stripe';
import { IonicStorageModule } from '@ionic/storage';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';

import { AutoCompleteModule } from 'ionic2-auto-complete';
import { ChartsModule } from 'ng2-charts';
import { MomentModule } from 'angular2-moment';
import { Ionic2MaskDirective } from 'ionic2-mask-directive';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VoucherProvider } from '../providers/voucher/voucher';
import { StripeJavaScriptPage } from '../pages/stripe-java-script/stripe-java-script';
import { ToastProvider } from '../providers/toast/toast';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { ClientHomePage } from '../pages/client-home/client-home';
import { PlansProvider } from '../providers/plans/plans';
import { LoginPage } from '../pages/login/login';
import { AddPlansPage } from '../pages/add-plans/add-plans';
import { VendorListPage } from '../pages/vendor-list/vendor-list';
import { AddVendorPage } from '../pages/add-vendor/add-vendor';
import { ViewVendorPage } from '../pages/view-vendor/view-vendor';
import { BannerPage } from '../pages/banner/banner';
import { CouponsPage } from '../pages/coupons/coupons';
import { VendorProvider } from '../providers/vendor/vendor';
import { UserProvider } from '../providers/user/user';
import { LoadingProvider } from '../providers/loading/loading';
import { VoucherPage } from '../pages/voucher/voucher';
import { MenuFilterPipe } from '../pipes/menu-filter/menu-filter';
import { WalletProvider } from '../providers/wallet/wallet';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';
import { AddWalletPage } from '../pages/add-wallet/add-wallet';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { TransactionPage } from '../pages/transaction/transaction';
import { TransferVoucherPage } from '../pages/transfer-voucher/transfer-voucher';
import { EditPlanPage } from '../pages/edit-plan/edit-plan';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { UserAutoCompleteProvider } from '../providers/user-auto-complete/user-auto-complete';
import { PlansAutoCompleteProvider } from '../providers/plans-auto-complete/plans-auto-complete';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SetupComponent } from '../components/setup/setup';
import { BackgroundImage } from '../components/background-image/background-image';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { PreloadImage } from '../components/preload-image/preload-image';
import { Rating } from '../components/rating/rating';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { BannerProvider } from '../providers/banner/banner';
import { CouponProvider } from '../providers/coupon/coupon';
import { AddCouponPage } from '../pages/add-coupon/add-coupon';
import { AppVersion } from '@ionic-native/app-version';
import { WalletTransferPage } from '../pages/wallet-transfer/wallet-transfer';
import { ClientListingPage } from '../pages/client-listing/client-listing';
import { AddClientPage } from '../pages/add-client/add-client';
import { ViewClientPage } from '../pages/view-client/view-client';
import { Push } from '@ionic-native/push'

@NgModule({
    declarations: [
        MyApp,
        // pages
        HomePage,
        LoginPage,
        AdminHomePage,
        ClientHomePage,
        StripeJavaScriptPage,
        AddPlansPage,
        ClientListingPage,
        AddClientPage,
        ViewClientPage,
        VendorListPage,
        AddVendorPage,
        ViewVendorPage,
        VoucherPage,
        ProfilePage,
        RegisterPage,
        AddWalletPage,
        TransactionPage,
        ContactUsPage,
        TransferVoucherPage,
        EditPlanPage,
        ChangePasswordPage,
        DashboardPage,
        CouponConfirmationPage,
        BannerPage,
        AddBannerPage,
        CouponsPage,
        AddCouponPage,
        WalletTransferPage,
        // pipe
        MenuFilterPipe,
        Ionic2MaskDirective,
        // entryComponents
        SetupComponent,
        BackgroundImage,
        ColorRadio,
        CounterInput,
        PreloadImage,
        Rating,
        ShowHideContainer,
        ShowHideInput,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        NgxStripeModule.forRoot('***your-stripe-publishable key***'),
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AutoCompleteModule,
        ChartsModule,
        MomentModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        StripeJavaScriptPage,
        AdminHomePage,
        ClientHomePage,
        AddPlansPage,
        ClientListingPage,
        AddClientPage,
        ViewClientPage,
        VendorListPage,
        AddVendorPage,
        ViewVendorPage,
        VoucherPage,
        ProfilePage,
        RegisterPage,
        AddWalletPage,
        TransactionPage,
        ContactUsPage,
        TransferVoucherPage,
        EditPlanPage,
        ChangePasswordPage,
        DashboardPage,
        BannerPage,
        CouponsPage,
        AddBannerPage,
        AddCouponPage,
        CouponConfirmationPage,
        WalletTransferPage,
        // custom component
        SetupComponent,
        BackgroundImage,
        CounterInput,
        PreloadImage,
        Rating,
        ShowHideContainer,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Stripe,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        Clipboard,
        SocialSharing,
        AppRate,
        AppVersion,
        Facebook,
        TwitterConnect,
        GooglePlus,
        // Image Upload
        FileTransfer,
        FileTransferObject,
        Camera,
        // custom
        VoucherProvider,
        ToastProvider,
        PlansProvider,
        VendorProvider,
        UserProvider,
        LoadingProvider,
        WalletProvider,
        UserAutoCompleteProvider,
        PlansAutoCompleteProvider,
        BannerProvider,
        CouponProvider,
        Push
    ]
})
export class AppModule { }
