import * as React from 'react';
import PropTypes from 'prop-types';
import PopupState, { bindMenu, bindHover } from 'material-ui-popup-state';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ChevronRight from '@mui/icons-material/ChevronRight';

import { useRouter } from 'src/routes/hooks';

import { _menu } from 'src/_mock';

import HoverMenu from './hover-menu';

const CascadingContext = React.createContext({
  parentPopupState: null,
  rootPopupState: null,
});

function CascadingMenuItem({ onClick, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  if (!rootPopupState) throw new Error('must be used inside a CascadingMenu');
  const handleClick = React.useCallback(
    (event) => {
      rootPopupState.close(event);
      if (onClick) onClick(event);
    },
    [rootPopupState, onClick]
  );

  return <MenuItem {...props} onClick={handleClick} />;
}

function CascadingSubmenu({ title, onClick, popupId, ...props }) {
  const { parentPopupState } = React.useContext(CascadingContext);

  const handleClick = React.useCallback(
    (event) => {
      parentPopupState.close(event);
      if (onClick) onClick(event);
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
          <MenuItem {...bindHover(popupState)} onClick={handleClick} >
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

function CascadingMenu({ popupState, ...props }) {
  const { rootPopupState } = React.useContext(CascadingContext);
  const context = React.useMemo(
    () => ({
      rootPopupState: rootPopupState || popupState,
      parentPopupState: popupState,
    }),
    [rootPopupState, popupState]
  );

  return (
    <CascadingContext.Provider value={context}>
      <HoverMenu {...props} {...bindMenu(popupState)} />
    </CascadingContext.Provider>
  );
}

const Menu = () => {
  const [categories, setCategories] = React.useState();

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

const MenuItem1 = ({ parent, children }) => {
  const router = useRouter();
  const handleRoute = (category) => {
    router.push(`/${category.value}`);
  };
  return (
    <PopupState variant="popover" popupId="demoMenu" disableAutoFocus>
      {(popupState) => (
        <Box>
          <Button
            color="inherit"
            variant={location.pathname.includes('/shop') ? 'outlined' : ''}
            {...bindHover(popupState)}
            sx={{ mr: 0.5, color: '#000', fontSize: '16px', fontWeight: 500 }}
            onClick={() => router.push(`/${parent.value}`)}
          >
            {parent.name}
          </Button>
          {children.length > 0 && <CascadingMenu
            popupState={popupState}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {children?.map((child) => (
              <CascadingMenuItem key={child.id} onClick={() => handleRoute(child)}>
                {child.name}
              </CascadingMenuItem>
            ))}
          </CascadingMenu>}
        </Box>
      )}
    </PopupState>
  );
}

CascadingMenuItem.propTypes = {
  onClick: PropTypes.func,
};

CascadingSubmenu.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  popupId: PropTypes.any,
};

CascadingMenu.propTypes = {
  popupState: PropTypes.any,
};

Menu.propTypes = {
  name: PropTypes.any,
  path: PropTypes.any,
  sx: PropTypes.any,
  selected: PropTypes.any,
};

export default Menu;
