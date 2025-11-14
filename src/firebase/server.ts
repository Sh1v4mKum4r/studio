import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeServerApp() {
  if (!getApps().length) {
    let firebaseApp: App;
    try {
      // Attempt to initialize via GOOGLE_APPLICATION_CREDENTIALS
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Automatic server initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp({ projectId: firebaseConfig.projectId });
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(app: App) {
  return {
    app,
    firestore: getFirestore(app),
  };
}
