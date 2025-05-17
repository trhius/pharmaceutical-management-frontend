import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from 'src/sections/reset-password';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Reset Password - ${CONFIG.appName}`}</title>

      <ResetPasswordView />
    </>
  );
}
