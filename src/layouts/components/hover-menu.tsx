import type { MenuProps } from '@mui/material/Menu';
import type { ForwardedRef, ReactElement, CSSProperties } from 'react';

import { useMemo, forwardRef } from 'react';

import _Menu from '@mui/material/Menu';


function interopRequireDefault<T>(defaultImport: T): T {
  const asAny = defaultImport as any;
  return asAny.__esModule ? asAny.default : defaultImport;
}

const Menu = interopRequireDefault(_Menu);

type HoverMenuProps = MenuProps & {
  style?: CSSProperties;
  PaperProps?: {
    style?: CSSProperties;
    [key: string]: any;
  };
  slotProps?: {
    paper?: Record<string, any> | ((ownerProps: any) => Record<string, any>);
    [key: string]: any;
  };
};

function HoverMenu1(props: HoverMenuProps, ref: ForwardedRef<HTMLDivElement | null>): ReactElement {
  const { slotProps, style, ...rest } = props;

  const paperSlotProps = useMemo(() => {
    const wrapped = slotProps?.paper;
    if (typeof wrapped === 'function') {
      return (ownerProps: any) => {
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
      style: { pointerEvents: 'auto' as CSSProperties['pointerEvents'], ...wrapped?.style },
    };
  }, [slotProps]);

  return (
    <Menu
      {...rest}
      ref={ref}
      style={{ pointerEvents: 'none', ...style }}
      slotProps={{
        ...slotProps,
        paper: paperSlotProps,
      }}
    />
  );
}

const HoverMenu = forwardRef(HoverMenu1);

export default HoverMenu;
