import { FaroLocalStorage } from "@/utils/localStorage";
import { useStorefrontStore } from "@/state/StorefrontStore";

class Wallet {
  constructor(provider) {
    this.provider = provider;
  }

  async connectWallet(chain) {
    try {
      const faroLocalStorage = new FaroLocalStorage(useStorefrontStore.getState().storefront?.title || '', 3);
      const defaultChainMagic = faroLocalStorage.getItem("defaultChainMagic");
      await this.provider.connect(chain || defaultChainMagic);
    } catch (err) {
      console.log("error occured: ----->", err);
    }
  }

  getAddress() {
    const address = this.provider.address;
    return address;
  }

  disconnectWallet() {
    this.provider.disconnect();
  }

  getChainId() {
    const chainId = this.provider.chain;
    return chainId;
  }

  getSigner() {
    const signer = this.provider.signer;
    return signer;
  }

  showWallet() {
    this.provider.showWallet();
  }

  getWalletName() {
    return this.provider.name;
  }

  walletIsConnected() {
    return this.provider.isConnected;
  }

}


export default Wallet;