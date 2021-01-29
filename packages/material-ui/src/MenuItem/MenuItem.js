import * as React from 'react';
import { deepmerge } from '@material-ui/utils';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@material-ui/unstyled';
import experimentalStyled, { shouldForwardProp } from '../styles/experimentalStyled';
import useThemeProps from '../styles/useThemeProps';
import { getMenuItemUtilityClass } from './menuItemClasses';
import ListItem from '../ListItem';
import { overridesResolver as listItemOverridesResolver, ListItemRoot } from '../ListItem/ListItem';

const overridesResolver = (props, styles) => {
  const { styleProps } = props;
  return deepmerge(listItemOverridesResolver(props, styles), {
    ...(styleProps.dense && styles.dense),
  });
};

const useUtilityClasses = (styleProps) => {
  const { selected, disableGutters, dense, classes } = styleProps;
  const slots = {
    root: ['root', selected && 'selected', !disableGutters && 'gutters', dense && 'dense'],
  };

  return composeClasses(slots, getMenuItemUtilityClass, classes);
};

const MenuItemRoot = experimentalStyled(
  ListItemRoot,
  { shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes' },
  {
    name: 'MuiMenuItem',
    slot: 'Root',
    overridesResolver,
  },
)(({ theme, styleProps }) => ({
  ...theme.typography.body1,
  minHeight: 48,
  paddingTop: 6,
  paddingBottom: 6,
  boxSizing: 'border-box',
  width: 'auto',
  whiteSpace: 'nowrap',
  [theme.breakpoints.up('sm')]: {
    minHeight: 'auto',
  },
  ...(styleProps.dense && {
    ...theme.typography.body2,
    minHeight: 'auto',
  }),
}));

const MenuItem = React.forwardRef(function MenuItem(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiMenuItem' });
  const {
    className,
    component = 'li',
    disableGutters = false,
    ListItemClasses,
    role = 'menuitem',
    selected,
    tabIndex: tabIndexProp,
    dense = false,
    ...other
  } = props;

  const styleProps = {
    ...props,
    selected,
    disableGutters,
    dense,
  };

  const classes = useUtilityClasses(styleProps);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <ListItem
      components={{ Root: MenuItemRoot }}
      componentsProps={{ root: { styleProps } }}
      button
      role={role}
      tabIndex={tabIndex}
      component={component}
      selected={selected}
      disableGutters={disableGutters}
      classes={ListItemClasses}
      className={clsx(classes.root, className)}
      ref={ref}
      {...other}
    />
  );
});

MenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  button: PropTypes.bool,
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input is used.
   * The prop defaults to the value inherited from the parent List component.
   * @default false
   */
  dense: PropTypes.bool,
  /**
   * @ignore
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the left and right padding is removed.
   * @default false
   */
  disableGutters: PropTypes.bool,
  /**
   * `classes` prop applied to the [`ListItem`](/api/list-item/) element.
   */
  ListItemClasses: PropTypes.object,
  /**
   * @ignore
   */
  role: PropTypes.string,
  /**
   * @ignore
   */
  selected: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
  /**
   * @ignore
   */
  tabIndex: PropTypes.number,
};

export default MenuItem;
