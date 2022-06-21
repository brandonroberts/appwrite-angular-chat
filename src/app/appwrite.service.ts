import { inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { Appwrite, Models } from 'appwrite';
import { BehaviorSubject, from, take, concatMap, filter } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  chatCollectionId: string;
}

type Message = Models.Document & {
  user: string;
  message: string;
  created: string;
};

export const AppwriteEnvironment = new InjectionToken<AppwriteConfig>(
  'Appwrite Config',
  {
    providedIn: 'root',
    factory() {
      const { endpoint, projectId, chatCollectionId } = environment;
      return {
        endpoint,
        projectId,
        chatCollectionId,
      };
    },
  }
);

export const AppwriteApi = new InjectionToken<Appwrite>('Appwrite SDK', {
  providedIn: 'root',
  factory() {
    const env = inject(AppwriteEnvironment);
    const appwrite = new Appwrite();
    appwrite.setEndpoint(env.endpoint);
    appwrite.setProject(env.projectId);

    return appwrite;
  },
});

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  private appwriteAPI = inject(AppwriteApi);
  private appwriteEnvironment = inject(AppwriteEnvironment);
  private _user = new BehaviorSubject<Models.User<Models.Preferences> | null>(
    null
  );
  user$ = this._user.asObservable();
  private _messages$ = new BehaviorSubject<Message[]>([]);
  messages$ = this._messages$.asObservable();

  constructor(private router: Router) {}

  login(name: string) {
    const authReq = this.appwriteAPI.account
      .createAnonymousSession()
      .then((res) => {
        this.appwriteAPI.account.updateName(name);
        this._user.next(res as unknown as Models.User<Models.Preferences>);
        return res;
      });

    return from(authReq);
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

  logout() {
    this.appwriteAPI.account.deleteSession('current').then(() => {
      this.router.navigate(['/']);
    });
  }

  loadMessages() {
    this.appwriteAPI.database
      .listDocuments<Message>(
        this.appwriteEnvironment.chatCollectionId,
        [],
        100,
        0,
        undefined,
        undefined,
        [],
        ['ASC']
      )
      .then((response) => {
        this._messages$.next(response.documents);
      });
  }

  sendMessage(message: string) {
    return this.user$.pipe(
      filter((user) => !!user),
      take(1),
      concatMap((user) => {
        const data = {
          user: user!.name.toLowerCase(),
          message,
          created: new Date().toISOString(),
        };

        return this.appwriteAPI.database.createDocument(
          this.appwriteEnvironment.chatCollectionId,
          'unique()',
          data
        );
      })
    );
  }

  listenToMessages() {
    return this.appwriteAPI.subscribe(
      `collections.${this.appwriteEnvironment.chatCollectionId}.documents`,
      (res) => {
        if (res.events.includes('collections.*.documents.*.create')) {
          const messages: Message[] = [
            ...(this._messages$.value as Message[]),
            res.payload as Message,
          ];
          this._messages$.next(messages);
          setTimeout(() => {
            document
              .getElementById(`${(res.payload as Message).$id}`)
              ?.scrollIntoView();
          });
        }
      }
    );
  }
}
