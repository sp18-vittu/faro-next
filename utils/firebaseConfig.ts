import env from "@/constant/env";
const projectId = env.FIREBASE_PROJECT_ID || 'faroverseDev';

export const firebaseConfig = {
  projectId,
  apiKey: env.FIREBASE_API_KEY || 'faroverseDev',
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || 'faroverseDev',
  appId: env.FIREBASE_APP_ID || 'faroverseDev',
}