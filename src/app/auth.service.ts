import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from 'appwrite';
import { BehaviorSubject, concatMap, from, tap, mergeMap } from 'rxjs';
import { AppwriteApi } from './appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private appwriteAPI = inject(AppwriteApi);
  private _user = new BehaviorSubject<Models.User<Models.Preferences> | null>(
    null
  );
  readonly user$ = this._user.asObservable();

  constructor(private router: Router) {}

  login(name: string) {
    const authReq = this.appwriteAPI.account.createAnonymousSession();

    return from(authReq).pipe(
      mergeMap(() => this.appwriteAPI.account.updateName(name)),
      concatMap(() => this.appwriteAPI.account.get()),
      tap((user) => this._user.next(user))
    );
  }

  async isLoggedIn() {
    try {
      const user = await this.appwriteAPI.account.get();
      this._user.next(user);
      return true;
    } catch (e) {
      return false;
    }
  }

  async logout() {
    try {
      await this.appwriteAPI.account.deleteSession('current');
    } catch (e) {
      console.log(`${e}`);
    } finally {
      this.router.navigate(['/']);
      this._user.next(null);
    }
  }
}
