import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

    activeUser = new BehaviorSubject(null);

    constructor(private storage: Storage) {
        console.log('Hello UserProvider Provider');
        this.storage.get('user').then(user => this.activeUser.next(user));
    }

    setUser(user) {
        this.storage.set('user', user);
        this.activeUser.next(user);
    }



}
