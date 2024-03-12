import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions } from '@ionic-enterprise/auth';
import { SessionVaultService } from './session-vault.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isReady: Promise<void>;
  private provider: Auth0Provider;
  private authOptions: ProviderOptions;

  constructor(private session: SessionVaultService) {
    const isNative = Capacitor.isNativePlatform();
    this.provider = new Auth0Provider();
    this.authOptions = {
      audience: 'https://io.ionic.demo.ac',
      clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
      discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
      logoutUrl: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
      redirectUri: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
      scope: 'openid offline_access email picture profile',
    };
    this.isReady = AuthConnect.setup({
      platform: isNative ? 'capacitor' : 'web',
      logLevel: 'DEBUG',
      ios: {
        webView: 'private'
      },
      web: {
        uiMode: 'popup',
        authFlow: 'PKCE',
      },
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const authResult = await this.getAuthResult();
    return (
      !!authResult && (await AuthConnect.isAccessTokenAvailable(authResult))
    );
  }

  async login(traceCb?: (duration: number) => void): Promise<void> {
    let start: number|undefined;

    await this.isReady;
    if (traceCb) {
      start = performance.now();
    }
    const authResult = await AuthConnect.login(this.provider, this.authOptions);
    traceCb && start && traceCb(Math.ceil(performance.now() - start));
    await this.saveAuthResult(authResult);
  }

  async logout(): Promise<void> {
    await this.isReady;
    const authResult = await this.getAuthResult();
    if (authResult) {
      await AuthConnect.logout(this.provider, authResult);
      this.saveAuthResult(null);
    }
  }

  private async getAuthResult(): Promise<AuthResult | null> {
    return this.session.getSession();
  }

  private async saveAuthResult(authResult: AuthResult | null): Promise<void> {
    if (authResult) {
      await this.session.setSession(authResult);
    } else {
      await this.session.clearSession();
    }
  }
}
