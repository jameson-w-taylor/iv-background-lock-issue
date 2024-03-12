# Identity Vault Issue Reproduction
This application was created to demonstrate and issue on Android where `lockAfterBackgrounded` is not working properly in a specific scenario.

A customer has a requirement where an initial login does _not_ request a refresh token from their authentication provider. Later on, if a user opts-in to a more secure `Vault` type the app will re-invoke `AuthConnect.login()` with a modified scope to then request a refresh token they can securely store.

This brief webview shown by AC dismisses quickly enough it seems the app backgrounded logic in IV is not triggered by the app resume logic **does**. This causes an issue because it will default to locking the `Vault` _and_ identifies it as a timeout scenario even when it doesn't meet the configured `lockAfterBackgrounded` duration.

This can be observed by following the steps shown within the UI of the application on an Android device. With the Android Studio debugger running and a breakpoint on line 218 in `VaultBase.java`, the `backgroundEnteredTimestamp` variable will be null when it shouldn't be.

The customer mentioned they saw it on several Samsung devices, but I was able to reproduce this on a Xiaomi device as well. This does _not_ appear to reproduce on iOS. After reverting to v5.11.x of IV, the issue does not present itself.

## Developer Setup
This assumes you have a properly setup environment. The iOS and Android platforms have already been added, so opening those projects and running them on devices should be all that's needed.