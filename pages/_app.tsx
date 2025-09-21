import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { Poppins, Lato } from "next/font/google";
import { useRouter } from "next/router";
import * as Fathom from "fathom-client";
import { ConfigProvider } from "antd";
import { appWithTranslation } from "next-i18next";
import { shallow } from "zustand/shallow";
import { useThemeStore } from "@/state/ThemeDetailsStore";

import ThemeManager from "@/components/ThemeManager";

import env from "@/constant/env";
import AppContext from "../context/appContext";

import { getCategoriesPublic } from "@/utils/commonApiUtils";

import { usePassStore } from "@/state/PassState";
import { useWalletStore } from "@/state/WalletStore";
import { useModalStore } from "@/state/ModalStore";
import { FirebaseCloudMessaging } from "@/utils/firebaseCloudMessaging";
import { FaroLocalStorage } from "@/utils/localStorage";
import { useStorefrontStore } from "@/state/StorefrontStore";
import { UserDetails, LoginMethod, PassData } from "@/shared/types/types";
import { getPass } from "@/components/Claim/ClaimModal/apiUtils";

import "../styles/global.scss";
import { useBenefitStore } from "@/state/BenefitState";
import { getStoreFrontDetailsFromClient } from "@/utils/homePageApiUtils";

const poppins = Poppins({ weight: "400", style: "normal", subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loginFromDb, setLoginFromDb] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>();
  const [categories, setCategories] = useState<any>();
  const setBenefits = useBenefitStore((state) => state.setBenefits);
  const setStorefront = useStorefrontStore((state) => state.setStorefront);
  const setPassData = usePassStore((state) => state.setPassData);
  const passData = usePassStore((state) => state.passData);
  const setPointsTotal = usePassStore((state) => state.setPointsTotal);
  const setSignIn = useModalStore((state) => state.setSignIn);
  const themeDetails = useThemeStore((state) => state.themeDetails);

  const setIsLoggedIn = useWalletStore((state: any) => state.setIsLoggedIn);
  const store = useStorefrontStore((state: any) => state.storefront, shallow);

  const pathName = router.query.title;
  let storefrontTitle = "";
  storefrontTitle = pathName
    ? Array.isArray(pathName)
      ? pathName[0]
      : pathName
    : "";
  const faroLocalStorage = new FaroLocalStorage(storefrontTitle || "", 3);

  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load("KNYJGDUH", {
      includedDomains: [
        "store-dev.faro.xyz",
        "store.faro.xyz",
        "jp.faro.xyz",
        "localhost:3001",
      ],
      honorDNT: true,
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`../firebase-messaging-sw.js`)
        .then(function () {
          return navigator.serviceWorker.ready;
        })
        .then(
          function (registration) {
            console.log(registration); // service worker is ready and working...
          },
          function (error) {
            // Service worker registration failed
            console.log("Registration Failed", error);
          }
        );
      (async () => {
        const firebaseCloudMessaging = new FirebaseCloudMessaging();
        if (!(await firebaseCloudMessaging.tokenInlocalforage())) {
          navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("event for the service worker", event);
          });
          navigator.serviceWorker.addEventListener("push", (event) => {
            console.log("event for the service worker", event);
          });
        }
      })();
    }
    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = async () => {
    // For default login method
    // if (faroLocalStorage.getItem("authorization") && !passData) {
    //   const {
    //     benefits,
    //     storefront: newStorefront,
    //     collectionList,
    //     program,
    //   } = await getStoreFrontDetailsFromClient(storefrontTitle);
    //   setBenefits(benefits);
    //   setStorefront(newStorefront);
    //   const response = await getPass(store?.title);
    //   if (response?.status === 200) {
    //     setPassData(response?.data as PassData);
    //     setPointsTotal((response?.data as PassData).pointsTotal);
    //     setUserDetails(response?.data?.me);
    //     setIsLoggedIn(true);
    //     setLoginFromDb(true);
    //   } else {
    //     setIsLoggedIn(false);
    //     setLoginFromDb(false);
    //     setPassData(null);
    //     setPointsTotal(0);
    //   }
    // }
    const response = await getPass(store?.title);
    if (response?.status === 200) {
      setPassData(response?.data as PassData);
      setPointsTotal((response?.data as PassData).pointsTotal);
      setUserDetails(response?.data?.me);
      setIsLoggedIn(true);
      setLoginFromDb(true);
    } else {
      setIsLoggedIn(false);
      setLoginFromDb(false);
      setPassData(null);
      setPointsTotal(0);
    }
  };

  //Get benefit categories
  useEffect(() => {
    const getCategories = async () => {
      const response = await getCategoriesPublic(storefrontTitle);

      if (response?.status === 200) {
        setCategories(response.data);
      }
    };
    getCategories();
  }, []);
  // // // verify if user has valid session.
  // useEffect(() => {
  //   const pathName = router.query.title;
  //   let storefrontTitle = '';
  //   storefrontTitle = pathName ? Array.isArray(pathName) ? pathName[0] : pathName : '';
  //   const faroLocalStorage = new FaroLocalStorage(storefrontTitle || '', 3);
  //   const token = faroLocalStorage.getItem("authorization");
  //   if (address && token) {
  //     (async () => {
  //       const response = await verifyPublicToken();
  //       if (!response.data.valid && currentWallet) {
  //         await logoutMagicAndUser();
  //       }
  //       if (response.data.valid) {
  //         setLoginFromDb(true);
  //       }
  //     })();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [address]);
  return (
    <>
      <ThemeManager {...themeDetails} />
      <style jsx global>{`
        @font-face {
          font-family: ${poppins.style.fontFamily};
          font-display: swap;
        }
        .container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          max-width: 100vw;
        }
      `}</style>
      <AppContext.Provider
        value={
          {
            loginFromDb,
            setLoginFromDb,
            userDetails,
            getUser,
            setUserDetails,
            categories,
          } as any
        }
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#313FAE",
            },
            components: {
              Tabs: {
                // inkBarColor: "#BB52F5",
                inkBarColor: "#3200CE",
              },
            },
          }}
        >
          <Component {...pageProps} />
        </ConfigProvider>
      </AppContext.Provider>
    </>
  );
}

export default appWithTranslation(App);
