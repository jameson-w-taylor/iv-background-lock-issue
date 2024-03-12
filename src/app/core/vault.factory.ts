import { Vault } from '@ionic-enterprise/identity-vault';

export class VaultFactory {
  static create(): Vault {
    return new Vault();
  }
}