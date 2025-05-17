import { CONFIG } from 'src/config-global';

import { ProductView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <ProductView />
    </>
  );
}
