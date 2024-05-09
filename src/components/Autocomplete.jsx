import { Popper } from '@mui/base';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import { Button, IconButton, Tooltip } from '@mui/material';
import { css, styled } from '@mui/system';
import { IconCheckbox, IconChevronDown, IconSearch, IconSquare, IconX } from '@tabler/icons-react';
import * as React from 'react';

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

export default function AutocompleteButton({ label, onChange, withAllOption, buttonProps, autocompleteProps }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const listOptions = withAllOption
    ? [{ id: 0, label: withAllOption, value: 0, name: 'all' }, ...autocompleteProps.options]
    : autocompleteProps.options;
  let autocompletePropsCopy = { ...autocompleteProps };
  autocompletePropsCopy.options = listOptions;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Button
          aria-describedby={id}
          type="button"
          color="neutral"
          onClick={handleClick}
          endIcon={<IconChevronDown size={16} />}
          sx={{ fontSize: '0.875rem', lineHeight: 1, textAlign: 'left', justifyContent: 'flex-start' }}
          {...buttonProps}
        >
          {truncate(label, 40)}
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 3 }}>
          <StyledPopperDiv>
            <AutocompletePopper
              handleClose={handleClick}
              //setLabel={handleLabelChange}
              options={listOptions}
              onChange={onChange}
              props={autocompletePropsCopy}
            />
          </StyledPopperDiv>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

const StyledPopperDiv = styled('div')(
  ({ theme }) => css`
    background-color: ${theme.palette.background.semiTransparent2};
    border-radius: 8px;
    border: ${theme.palette.border};
    box-shadow: ${theme.palette.mode === 'dark' ? `0px 4px 8px rgb(0 0 0 / 0.7)` : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    width: 280px;
    color: ${theme.palette.mode === 'dark' ? grey[100] : grey[700]};
    font-size: 0.875rem;
    font-weight: 500;
  `
);

function AutocompletePopper({ handleClose, props }) {
  const [inputValue, setInputValue] = React.useState('');
  const { onChange, ...otherProps } = props;
  const handleClick = (e, newValue) => {
    if (newValue) {
      onChange(e, newValue);
      !props.disableCloseOnSelect && handleClose();
      //handleClose();
      //setLabel(newValue);
      setInputValue('');
    }
  };

  const handleClear = (e) => {
    onChange(e, []);
    !props.disableCloseOnSelect && handleClose();
    //handleClose();
    //setLabel(newValue);
    setInputValue('');
  };

  const handleInputChange = (value) => {
    if (value !== 'undefined') {
      setInputValue(value);
    }
  };

  const { getRootProps, getInputLabelProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, focused } = useAutocomplete({
    inputValue: inputValue || '',
    onInputChange: (event, value) => handleInputChange(value),
    onChange: handleClick,
    ...otherProps
  });

  function isSelected(option) {
    if (otherProps.multiple) {
      return otherProps.value.find((v) => otherProps.isOptionEqualToValue(option, v));
    } else {
      return option.value === otherProps.value;
    }
  }

  const selectedLength = otherProps.multiple ? otherProps.value.length : Boolean(otherProps.value);

  return (
    <>
      <Root {...getRootProps()} className={focused ? 'Mui-focused' : ''}>
        <IconSearch size={18} style={{ margin: '0.5rem' }} /> <Input {...getInputProps()} autoFocus sx={{ marginRight: '22px' }} />
        {otherProps.multiple && Boolean(selectedLength) && (
          <Tooltip title="Clear selected" placement="top">
            <IconButton onClick={handleClear} size="small" sx={{ position: 'absolute', right: 0, top: 0 }}>
              <IconX size={18} style={{ margin: '0.5rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </Root>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <Option {...getOptionProps({ option, index })} aria-selected={isSelected(option)} name={option?.name}>
              {otherProps.multiple ? (
                <>
                  {isSelected(option) ? (
                    <IconCheckbox size={18} style={{ margin: '1px 6px 1px 0px', minWidth: '18px' }} />
                  ) : (
                    <IconSquare size={18} style={{ margin: '1px 6px 1px 0px', minWidth: '18px' }} />
                  )}
                  {option.label}
                </>
              ) : (
                <>{option.label}</>
              )}
            </Option>
          ))}
        </Listbox>
      )}
      {groupedOptions.length === 0 && props.options.length > 0 && Boolean(!inputValue) && (
        <Listbox {...getListboxProps()}>
          {props.options.map((option, index) => (
            <Option {...getOptionProps({ option, index })} ariaSelected={isSelected(option)} name={option?.name}>
              {otherProps.multiple ? (
                <>
                  {isSelected(option) ? (
                    <IconCheckbox size={18} style={{ margin: '1px 6px 1px 0px', minWidth: '18px' }} />
                  ) : (
                    <IconSquare size={18} style={{ margin: '1px 6px 1px 0px', minWidth: '18px' }} />
                  )}
                  {option.label}
                </>
              ) : (
                <>{option.label}</>
              )}
            </Option>
          ))}
        </Listbox>
      )}
      {groupedOptions.length === 0 && Boolean(inputValue) && (
        <Listbox {...getListboxProps()}>
          <NoOptions>No results</NoOptions>
        </Listbox>
      )}
    </>
  );
}

/* export default function AutocompletePopper() {
  const [value, setValue] = React.useState(null);

  const handleChange = (event, newValue) => setValue(newValue);

  return <Autocomplete options={top100Films} value={value} onChange={handleChange} />;
} */

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75'
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025'
};

const Label = styled('label')`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Input = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  border: none;
  padding: 8px 12px 8px 0px;
  outline: 0;
  width: 100%;
  display:inline;
  background: inherit;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
`
);

const Root = styled('div')(
  ({ theme }) => `
  font-weight: 400;
  border-radius: 8px;
  display: flex;
  gap: 5px;
  padding-right: 5px;
  overflow: hidden;
  width: 100%;
  border-bottom: ${theme.palette.border};
  border-radius: 0px;
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledInput = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

// ComponentPageTabs has z-index: 1000
const StyledPopper = styled('div')`
  position: relative;
  z-index: 1001;
  width: 320px;
`;

const Listbox = styled('ul')(
  ({ theme }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  `
);

const Option = styled('li')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }

  &[aria-selected=true] {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.Mui-focused,
  &.Mui-focusVisible {
      &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  }

  &.Mui-focusVisible {
    border: ${theme.palette.border};
  }

  &[aria-selected=true].Mui-focused,
  &[aria-selected=true].Mui-focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `
);

const NoOptions = styled('li')`
  list-style: none;
  padding: 8px;
  cursor: default;
`;

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
