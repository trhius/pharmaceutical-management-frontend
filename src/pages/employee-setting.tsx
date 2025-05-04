import { CONFIG } from 'src/config-global';

import { EmployeeInitView } from 'src/sections/employee/init';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Employee Setting - ${CONFIG.appName}`}</title>

      <EmployeeInitView />
    </>
  );
}
