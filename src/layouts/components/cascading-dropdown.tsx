
import * as React from 'react';
import PopupState, { bindMenu, bindHover } from 'material-ui-popup-state';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { useRouter } from 'src/routes/hooks';

import { _menu } from 'src/_mock';

import HoverMenu from './hover-menu';

type MenuItemType = {
  id: number;
  name: string;
  value?: string;
};

type MenuData = {
  parent: MenuItemType;
  children: MenuItemType[];
};

type CascadingContextType = {
  parentPopupState: any;
  rootPopupState: any;
};

const CascadingContext = React.createContext<CascadingContextType>({
  parentPopupState: null,
  rootPopupState: null,
});

type CascadingMenuItemProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

function CascadingMenuItem({ onClick, ...props }: CascadingMenuItemProps) {
  const { rootPopupState } = React.useContext(CascadingContext);
  if (!rootPopupState) throw new Error('must be used inside a CascadingMenu');

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      rootPopupState.close(event);
      onClick?.(event);
    },
    [rootPopupState, onClick]
  );

  return <MenuItem {...props} onClick={handleClick} />;
}

type CascadingSubmenuProps = {
  title: string;
  popupId: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

function CascadingSubmenu({ title, onClick, popupId, ...props }: CascadingSubmenuProps) {
  const { parentPopupState } = React.useContext(CascadingContext);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      parentPopupState?.close(event);
      onClick?.(event);
    },
    [parentPopupState, onClick]
  );

  return (
    <PopupState
      popupId={popupId}
      variant="popover"
      parentPopupState={parentPopupState}
      disableAutoFocus
    >
      {(popupState) => (
        <Box>
          <MenuItem {...bindHover(popupState)} onClick={handleClick}>
            <Box style={{ flexGrow: 1 }}>{title}</Box>
            <ChevronRight sx={{ ml: 1 }} />
          </MenuItem>
          <CascadingMenu
            {...props}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            popupState={popupState}
          />
        </Box>
      )}
    </PopupState>
  );
}

type CascadingMenuProps = {
  popupState: any;
  children: React.ReactNode;
  anchorOrigin?: any;
  transformOrigin?: any;
};

function CascadingMenu({ popupState, ...props }: CascadingMenuProps) {
  const { rootPopupState } = React.useContext(CascadingContext);

  const contextValue = React.useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={contextValue}>
      <HoverMenu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
}

const Menu = () => {
  const [categories, setCategories] = React.useState<MenuData[]>();

  React.useEffect(() => {
    setCategories(_menu.data);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 15 }}>
      {categories?.map((item) => (
        <MenuItem1 key={item.parent.id} parent={item.parent} children={item.children} />
      ))}
    </Box>
  );
};

type MenuItem1Props = {
  parent: MenuItemType;
  children: MenuItemType[];
};

const MenuItem1 = ({ parent, children }: MenuItem1Props) => {
  const router = useRouter();

  const handleRoute = (menuItem: MenuItemType) => {
    router.push(`/${menuItem.value}`);
  };

  return (
    <PopupState variant="popover" popupId="demoMenu" disableAutoFocus>
      {(popupState) => (
        <Box>
          <Button
            color="success"
            variant={children.map(c => c.value).includes(location.pathname.slice(1)) ? 'outlined' : undefined}
            {...bindHover(popupState)}
            sx={{ mr: 1, color: '#000', fontSize: '16px', fontWeight: 500 }}
            onClick={() => children.length === 0 && router.push(`/${parent.value}`)}
          >
            {parent.name}
          </Button>
          {children.length > 0 && (
            <CascadingMenu
              popupState={popupState}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              {children?.map((child) => (
                <CascadingMenuItem key={child.id} onClick={() => handleRoute(child)}>
                  {child.name}
                </CascadingMenuItem>
              ))}
            </CascadingMenu>
          )}
        </Box>
      )}
    </PopupState>
  );
};

export default Menu;
