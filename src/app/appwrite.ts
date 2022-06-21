import { inject, InjectionToken } from '@angular/core';
import { Appwrite } from 'appwrite';
import { environment } from 'src/environments/environment';

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  chatCollectionId: string;
}

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