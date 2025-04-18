import { CONFIG } from 'src/config-global';

import { SignUpView } from 'src/sections/sign-up';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>

      <SignUpView />
    </>
  );
}
