import { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { palette } from '@app/shared/lib/constants/palette';
import { initializeStorageEncryption } from '@app/shared/lib/storages/mmkvEncryptionKeyManager';
import { Spinner } from '@app/shared/ui/Spinner';

/**
 * Blocks the rest of the provider tree until the per-device MMKV encryption
 * key has been resolved from the keychain (and legacy stores migrated, on
 * the first launch after an update). Everything that touches secured MMKV
 * stores mounts below this gate.
 *
 * Renders a plain-RN placeholder (not SplashScreen) because Tamagui and
 * localization providers are not available above this point in the tree.
 */
export function StorageEncryptionProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeStorageEncryption()
      .then(() => setIsReady(true))
      // Only reachable when the keychain is unavailable AND no legacy
      // fallback key exists; the key manager has already logged details to
      // Datadog. The user stays on the spinner. TODO: revisit when
      // LEGACY_STORE_ENCRYPTION_KEY is removed, as this branch then becomes
      // reachable on devices with a broken keystore.
      .catch(console.error);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
