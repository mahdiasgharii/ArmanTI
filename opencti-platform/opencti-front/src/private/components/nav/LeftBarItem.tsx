import { ChevronDown as ArrowDropDown, ChevronUp as ArrowDropUp } from 'lucide-react';
import { Collapse, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, SxProps, Tooltip } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Theme } from '../../../components/Theme';
import useDraftContext from '../../../utils/hooks/useDraftContext';

interface SubMenuItem {
  type?: string;
  link: string;
  label: string;
  icon?: React.ReactNode;
  exact?: boolean;
  granted?: boolean;
}

interface LeftBarItemProps {
  id?: string;
  icon: React.ReactNode;
  label: string;
  link?: string;
  exact?: boolean;
  subItems?: SubMenuItem[];
  navOpen: boolean;
  selectedMenu: string[];
  onClick?: () => void;
  onMenuToggle: (id: string) => void;
  onMenuOpen: (id: string) => void;
  onMenuClose: () => void;
  onGoToPage: (event: React.MouseEvent, link: string) => void;
  isMobile: boolean;
  submenuShowIcons?: boolean;
  hiddenEntities?: string[];
  ariaLabel?: string;
}

const LeftBarItem: React.FC<LeftBarItemProps> = ({
  id,
  icon,
  label,
  link,
  exact = false,
  subItems = [],
  navOpen,
  selectedMenu,
  onClick,
  onMenuToggle,
  onMenuOpen,
  onMenuClose,
  onGoToPage,
  isMobile,
  submenuShowIcons = false,
  hiddenEntities = [],
  ariaLabel,
}) => {
  const location = useLocation();
  const theme = useTheme<Theme>();
  const draftContext = useDraftContext();
  const anchorRef = useRef<HTMLLIElement | null>(null);

  const visibleSubItems = subItems.filter(
    (item) => item.granted !== false && (!item.type || !hiddenEntities.includes(item.type)),
  );

  const hasSubItems = visibleSubItems.length > 0;
  const isMenuOpen = selectedMenu.includes(id);

  const isSelected = (itemLink: string, itemExact?: boolean) => {
    if (itemExact) {
      return location.pathname === itemLink;
    }

    // Special case where data and draft shares same url on start
    if (itemLink === '/dashboard/data' && location.pathname.includes('/import/draft/')) {
      return false;
    }

    return location.pathname === itemLink || location.pathname.startsWith(itemLink + '/');
  };

  const isParentSelected = isSelected(link, exact);

  const handleParentClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      e.stopPropagation();
      if (isMobile || navOpen) {
        onMenuToggle(id);
      } else {
        onGoToPage(e, link);
      }
    }
  };

  const renderMenuItem = (
    itemIcon: React.ReactNode,
    itemLabel: string,
    selected: boolean,
    showIcon = true,
    fontSize: 'default' | 'small' = 'default',
    forceShowText = false, // For popover items
  ) => {
    const isSubItem = fontSize === 'small';
    const iconColor = selected ? 'var(--ravin-primary)' : 'var(--ravin-text-muted)';
    const iconOpacity = selected ? 1 : 0.7;

    const getTextColor = () => {
      if (isSubItem && draftContext && selected) {
        return 'var(--ravin-warning)';
      }
      if (selected) {
        return 'var(--ravin-primary)';
      }
      if (isSubItem) {
        return 'var(--ravin-text-light)';
      }
      return 'var(--ravin-text)';
    };

    return (
      <>
        {showIcon && itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: '0px!important',
              mr: navOpen ? 1 : 0,
              opacity: iconOpacity,
              color: iconColor,
              '& svg': {
                fontSize: '18px',
              },
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}

        {(navOpen || forceShowText) && (
          <ListItemText
            primary={itemLabel}
            sx={{
              pt: 0.1,
            }}
            slotProps={{
              primary: {
                fontSize: fontSize === 'default' ? '14px' : '12px',
                color: getTextColor(),
                sx: {
                  fontFamily: 'Peyda, sans-serif',
                  textTransform: 'lowercase',
                  '&::first-letter': {
                    textTransform: 'uppercase',
                  },
                },
              },
            }}
          />
        )}
      </>
    );
  };

  // Render submenu item
  const renderSubMenuItem = (item: SubMenuItem, inCollapse: boolean) => {
    const itemSelected = isSelected(item.link, item.exact);

    const menuItem = (
      <MenuItem
        component={Link}
        to={item.link}
        dense
        onClick={inCollapse ? undefined : onMenuClose}
        sx={{
          px: 2,
          py: 0.75,
          height: '40px',
          borderRadius: '4px',
          mx: 1,
          backgroundColor: itemSelected ? 'var(--ravin-surface-2)' : 'transparent',
          '&:hover': {
            backgroundColor: 'var(--ravin-surface-2)',
          },
        }}
      >
        {renderMenuItem(item.icon, item.label, itemSelected, submenuShowIcons, 'small', !inCollapse)}
      </MenuItem>
    );

    return inCollapse ? (
      <Tooltip key={item.label} title={item.label} placement="right">
        {menuItem}
      </Tooltip>
    ) : (
      <div key={item.label}>{menuItem}</div>
    );
  };

  const getMenuStyles = (selected: boolean): SxProps => {
    return {
      px: navOpen ? 1.5 : 1,
      py: 0,
      height: '44px',
      borderRadius: '4px',
      mx: 0,
      backgroundColor: selected ? 'var(--ravin-surface-2)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: navOpen ? 'flex-start' : 'center',
      transition: 'background-color 0.15s ease',
      '&:hover': {
        backgroundColor: 'var(--ravin-surface-2)',
      },
    };
  };

  // No Subitems
  if (!hasSubItems) {
    return (
      <Tooltip title={!navOpen ? label : ''} placement="right">
        <MenuItem
          component={link ? Link : undefined}
          to={link}
          dense
          onClick={onClick}
          aria-label={ariaLabel}
          sx={getMenuStyles(isParentSelected)}
        >
          {renderMenuItem(icon, label, isParentSelected)}
        </MenuItem>
      </Tooltip>
    );
  }

  // Nav Opened, collapse subitems
  if (navOpen) {
    return (
      <>
        <MenuItem
          ref={anchorRef}
          dense
          onClick={handleParentClick}
          sx={getMenuStyles(isParentSelected)}
        >
          {renderMenuItem(icon, label, isParentSelected)}
          {isMenuOpen ? <ArrowDropUp size={20} /> : <ArrowDropDown size={20} />}
        </MenuItem>

        <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
          <MenuList
            component="nav"
            disablePadding
            sx={{
              py: 0.5,
              ml: '22px',
              borderLeft: '1px solid var(--ravin-border)',
            }}
          >
            {visibleSubItems.map((item) => renderSubMenuItem(item, true))}
          </MenuList>
        </Collapse>
      </>
    );
  }

  // Nav Closed, show popover with subitems
  return (
    <>
      <MenuItem
        ref={anchorRef}
        dense
        onClick={handleParentClick}
        onMouseEnter={() => onMenuOpen(id)}
        onMouseLeave={() => onMenuClose()}
        sx={getMenuStyles(isParentSelected)}
      >
        {renderMenuItem(icon, label, isParentSelected)}
      </MenuItem>

      {
        /*
        * Popover has pointerEvents: 'none' and Paper has pointerEvents: 'auto'
        * This keeps the popover open when the mouse moves from the menu item to the popover
        */
      }
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={isMenuOpen}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={onMenuClose}
        disableRestoreFocus
        disableScrollLock
        elevation={0}
        slotProps={{
          paper: {
            onMouseEnter: () => onMenuOpen(id),
            onMouseLeave: onMenuClose,
            sx: {
              pointerEvents: 'auto',
              width: 200,
              backgroundColor: 'var(--ravin-elevated)',
              border: '1px solid var(--ravin-border)',
              borderRadius: '4px',
              py: 0.5,
            },
          },
        }}
      >
        <MenuList component="nav" disablePadding>
          {visibleSubItems.map((item) => renderSubMenuItem(item, false))}
        </MenuList>
      </Popover>
    </>
  );
};

export default LeftBarItem;
