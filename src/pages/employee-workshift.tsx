import { CONFIG } from 'src/config-global';

import { EmployeeWorkshiftView } from 'src/sections/employee/work-shift/view/employee-workshift-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Employee Workshift - ${CONFIG.appName}`}</title>

      <EmployeeWorkshiftView />
    </>
  );
}
