import { Injectable } from '@angular/core';
import { BrowserVault, DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { VaultFactory } from './vault.factory';
import { AuthResult } from '@ionic-enterprise/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionVaultService {
  private key = 'session';
  private vault: BrowserVault | Vault;
  private lockedSubject: BehaviorSubject<{ locked: boolean; timeout?: boolean; } | undefined>;

  readonly lockAfterBackgrounded = 60000;

  get locked$(): Observable<{ locked: boolean; timeout?: boolean; } | undefined> {
    return this.lockedSubject.asObservable();
  }

  constructor() {
    this.vault = VaultFactory.create();
    this.lockedSubject = new BehaviorSubject<{ locked: boolean; timeout?: boolean; } | undefined>(undefined);
  }

  async initialize(): Promise<void> {
    await this.vault.initialize({
      key: 'com.primonial.allinrec',
      type: VaultType.DeviceSecurity,
      deviceSecurityType: DeviceSecurityType.Both,
      lockAfterBackgrounded: this.lockAfterBackgrounded,
    });

    const locked = await this.vault.isLocked();
    this.lockedSubject.next({ locked });

    this.vault.onLock(({ timeout }) => {
      this.lockedSubject.next({ locked: true, timeout });
    });

    this.vault.onUnlock(() => {
      const lastValue = this.lockedSubject.getValue();
      if (lastValue) {
        const { timeout } = lastValue;
        this.lockedSubject.next({ locked: false, timeout });
      } else {
        this.lockedSubject.next({ locked: false });
      }
    });
  }

  async getSession(): Promise<AuthResult | null> {
    if (await this.vault.isEmpty()) {
      return null;
    }
    return this.vault.getValue<AuthResult>(this.key);
  }

  async setSession(value: AuthResult): Promise<void> {
    await this.vault.setValue(this.key, value);
  }

  async clearSession(): Promise<void> {
    await this.vault.clear();
  }
}
