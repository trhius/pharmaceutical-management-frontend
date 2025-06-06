import { CONFIG } from 'src/config-global';

import { SignInView } from 'src/sections/auth/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <SignInView />
    </>
  );
}
