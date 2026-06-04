import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

type Listener = (isConnected: boolean) => void;

class NetworkService {
  private listeners: Set<Listener> = new Set();
  private _isConnected: boolean = true;

  constructor() {
    NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      if (connected !== this._isConnected) {
        this._isConnected = connected;
        this.listeners.forEach(l => l(connected));
      }
    });
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this._isConnected = state.isConnected ?? false;
    return this._isConnected;
  }
}

export const networkService = new NetworkService();
