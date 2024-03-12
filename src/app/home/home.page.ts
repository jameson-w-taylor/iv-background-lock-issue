import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private subscription: Subscription;
  authenticated = false;
  vaultLocked?: boolean;
  configuredBackgroundThreshold = this.sessionVault.lockAfterBackgrounded;
  observedBackgroundTime?: number;
  timeout?: boolean;

  constructor(private authentication: AuthenticationService, private sessionVault: SessionVaultService) {
    this.subscription = this.sessionVault.locked$.subscribe((status) => {
      if (status !== undefined) {
        const { locked, timeout } = status;
        this.vaultLocked = locked;
        this.timeout = timeout;
      }
    });
  }

  async ngOnInit() {
    await this.checkAuthentication();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async login(traceWebview = false): Promise<void> {
    await this.authentication.login(traceWebview ? this.setObservedBackgroundtime.bind(this) : undefined);
    await this.checkAuthentication();
  }

  async logout(): Promise<void> {
    await this.authentication.logout();
    await this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<void> {
    this.authenticated = await this.authentication.isAuthenticated();
  }

  private setObservedBackgroundtime(duration: number): void {
    this.observedBackgroundTime = duration;
  }
}
