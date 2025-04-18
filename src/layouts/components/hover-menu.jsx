import PropTypes from 'prop-types';
import React, { useMemo, forwardRef } from 'react';

import _Menu from '@mui/material/Menu';

function interopRequireDefault(defaultImport) {
  const asAny = defaultImport;
  return asAny.__esModule ? asAny.default : defaultImport;
}

// work around https://github.com/vercel/next.js/issues/57285
const Menu = interopRequireDefault(_Menu);

function HoverMenu1(props, ref) {
  
  const { slotProps, style, PaperProps } = props;
  const paperSlotProps = useMemo(() => {
    const wrapped = slotProps?.paper;
    if (wrapped instanceof Function) {
      return (ownerProps) => {
        const base = wrapped(ownerProps);
        return {
          ...base,
          style: {
            pointerEvents: 'auto',
            ...base?.style,
          },
        };
      };
    }
    return {
      ...wrapped,
      style: { pointerEvents: 'auto', ...wrapped?.style },
    };
  }, [slotProps]);

  return (
    <Menu
      {...props}
      ref={ref}
      style={{ pointerEvents: 'none', style }}
      PaperProps={{
        PaperProps,
        style: {
          pointerEvents: 'auto',
        },
      }}
      slotProps={{
        slotProps,
        paper: paperSlotProps,
      }}
    />
  );
}

const HoverMenu = forwardRef(HoverMenu1);

HoverMenu1.propTypes = {
  // PropTypes for the Menu component can be directly applied if known
  // or use PropTypes.shape for complex props
  style: PropTypes.object,
  PaperProps: PropTypes.shape({
    style: PropTypes.object,
  }),
  slotProps: PropTypes.shape({
    paper: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }),
};

export default HoverMenu;
