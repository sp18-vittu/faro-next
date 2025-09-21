import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import localforage from "localforage";
import env from "@/constant/env";
import { firebaseConfig } from "./firebaseConfig";

class FirebaseCloudMessaging {
  constructor(storefrontTitle = "") {
    this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.storefrontTitle = storefrontTitle;
  }

  tokenInlocalforage = async () => {
    const token = await localforage.getItem("fcm_token");
    console.log("fcm_token from localforage", token);
    return token;
  };

  storeTitleInLocalforage = async () => {
    const title = await localforage.getItem(`${this.storefrontTitle}`);
    return title;
  };

  isSupported = async () => {
    const fcmSupported = await isSupported();
    return fcmSupported;
  };

  init = async () => {
    try {
      const pastRequest = await localforage.getItem("pushPermission");
      const title = await localforage.getItem(`${this.storefrontTitle}`);
      //check if we already asked user and if he/she denied do ask again
      if (pastRequest && pastRequest === "denied") return null;

      const fcm_token = await this.tokenInlocalforage();
      if (
        fcm_token !== null &&
        this.storefrontTitle &&
        this.storefrontTitle === title
      ) {
        console.log("Firebase Cloud Messaging:", "FCM token already exists");
        return fcm_token;
      }
      console.log("Firebase Cloud Messaging:", "Creating FCM token");
      const fcmSupported = await isSupported();
      if (fcmSupported) {
        const messaging = getMessaging(this.app);

        // Request the push notification permission from browser
        const status = await Notification.requestPermission();
        if (status && status === "granted") {
          // Get new token from Firebase
          const fcm_token = await getToken(messaging, {
            vapidKey: env.FIREBASE_VAPID_KEY,
          });

          // Set token in our local storage
          if (fcm_token) {
            localforage.setItem("pushPermission", "granted");
            localforage.setItem("fcm_token", fcm_token);
            localforage.setItem(
              `${this.storefrontTitle}`,
              this.storefrontTitle
            );
            console.log("fcm_token: ", fcm_token);
            return fcm_token;
          }
        } else if (status && status === "denied") {
          //user explicitly denied permission so don't ask again
          console.log("user denied request for push notification");
          localforage.setItem("pushPermission", "denied");
          return null;
        }
      } else {
        console.log("Firebase Cloud Messaging:", "Unsupported FCM Browser");
        return null;
      }
    } catch (error) {
      console.error("Firebase Cloud Messaging:", error);
      return null;
    }
  };
}
// const firebaseCloudMessaging = new FirebaseCloudMessaging();
export { FirebaseCloudMessaging };
