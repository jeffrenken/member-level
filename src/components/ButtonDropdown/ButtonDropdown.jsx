import { Button, PopperBase } from '@/components';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import * as React from 'react';
import { useTheme } from '@/hooks';

import { styled } from '@mui/material/styles';

function truncate(str, n) {
  if (!str || str.length <= n) {
    return str;
  }
  return str.length > n ? `${str.substr(0, n - 1)}...` : str;
}

export function ButtonDropdown({
  options,
  defaultLabel,
  label,
  value,
  onChange,
  width = 178,
  search = false,
  handleClick,
  isLoading,
  itemComponent,
  to,
  variant,
  ...props
}) {
  const theme = useTheme();
  //const [label, setLabel] = React.useState(defaultLabel);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleButtonClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  /* React.useEffect(() => {
    if (value && options && options.length) {
      const l = options.find((o) => o.value === value);
      setLabel(l.label);
    }
  }, [value]); */
  const handleItemClick = (event, value) => {
    handleClickAway();
    handleClick(value);
  };

  const maxLabelLength = width / 11;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Button
          type='button'
          color='white'
          variant='contained'
          onClick={handleButtonClick}
          endIcon={<IconChevronDown size={16} style={{ strokeWidth: 4 }} />}
          sx={{
            width: width,
            lineHeight: 1,
            justifyContent: 'flex-end',
            color: open ? theme.palette.blue.light : theme.palette.gray.main,
            fontWeight: 400,
            fontSize: '1.1rem',
            py: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          {label ? truncate(label, maxLabelLength) : defaultLabel}
        </Button>
        <PopperBase id={id} open={open} anchorEl={anchorEl} placement='bottom-start' style={{ zIndex: 3 }}>
          <StyledPopperDiv width={width}>
            <AutocompletePopper
              handleClose={handleButtonClick}
              options={options}
              value={value}
              onChange={onChange}
              search={search}
              handleItemClick={handleItemClick}
              isLoading={isLoading}
              itemComponent={itemComponent}
              to={to}
              variant={variant}
              {...props}
            />
          </StyledPopperDiv>
        </PopperBase>
      </div>
    </ClickAwayListener>
  );
}

const StyledPopperDiv = styled('div')(
  ({ theme, width }) => `
    background-color: #fff;
    border-radius: 0px;
    box-shadow: ${theme.palette.mode === 'dark' ? `0px 4px 8px rgb(0 0 0 / 0.7)` : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    width: ${width}px;
    font-size: 0.875rem;
    font-weight: 500;
  `
);

function AutocompletePopper({
  options,
  handleClose,
  value,
  onChange,
  search,
  handleItemClick,
  isLoading,
  itemComponent,
  to,
  variant,
  ...props
}) {
  const [inputValue, setInputValue] = React.useState('');
  const handleChange = (e, newValue) => {
    if (newValue) {
      handleItemClick(e, newValue);
      handleClose();
      setInputValue('');
    }
  };

  const handleInputChange = (value) => {
    if (value !== 'undefined') {
      setInputValue(value);
    }
  };

  const { getRootProps, getInputLabelProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, focused } =
    useAutocomplete({
      id: 'use-autocomplete-demo',
      options: options || [],
      getOptionLabel: (option) => (option?.label ? option.label.toString() : ''),
      autoSelect: true,
      autoHighlight: true,
      openOnFocus: true,
      value: value || null,
      inputValue: inputValue || '',
      onInputChange: (event, value) => handleInputChange(value),
      onChange: (event, newValue) => handleChange(event, newValue),
      isOptionEqualToValue: (option, value) => {
        return option.value === value;
      },
    });

  return (
    <>
      <Root {...getRootProps()} className={focused ? 'Mui-focused' : ''}>
        <SearchInput style={{ display: search ? 'flex' : 'none', width: '100%' }} variant={variant}>
          <IconSearch size={18} style={{ margin: '0.5rem' }} /> <Input {...getInputProps()} autoFocus />
        </SearchInput>
      </Root>
      <Listbox {...getListboxProps()} variant={variant}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {groupedOptions.length > 0 &&
              groupedOptions.map((option, index) => (
                <Option
                  {...getOptionProps({ option, index })}
                  onClick={(e) => handleChange(e, option)}
                  variant={variant}
                >
                  {option.label}
                </Option>
              ))}
            {groupedOptions.length === 0 &&
              options?.length > 0 &&
              Boolean(!inputValue) &&
              options.map((option, index) => (
                <Option
                  {...getOptionProps({ option, index })}
                  onClick={(e) => handleChange(e, option)}
                  variant={variant}
                  aria-selected={value === option.value}
                >
                  {option.label}
                </Option>
              ))}
            {groupedOptions.length === 0 && Boolean(inputValue) && <NoOptions>No results</NoOptions>}
          </>
        )}
      </Listbox>
    </>
  );
}

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
`
);

const Root = styled('div')(
  ({ theme }) => `
  font-weight: 400;
  border-radius: 8px;
  display: flex;
  gap: 5px;
  overflow: hidden;
  width: 100%;
  border-bottom: ${theme.palette.border};
  border-radius: 0px;
  &:focus-visible {
    outline: 0;
  }
`
);

const SearchInput = styled('div', { shouldForwardProp: (prop) => prop !== 'variant' })(
  ({ theme, variant }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px 0;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  background-color: ${variant === 'bordered' ? theme.palette.gray.light : 'none'};
  border: ${variant === 'bordered' ? '1px solid #000' : 'none'};
  border-bottom: none;
  `
);

const Listbox = styled('ul', { shouldForwardProp: (prop) => prop !== 'variant' })(
  ({ theme, variant }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px 0;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  background-color: ${variant === 'bordered' ? theme.palette.gray.light : 'none'};
  border: ${variant === 'bordered' ? '1px solid #000' : 'none'};
  `
);

const Option = styled('li')(
  ({ theme, variant }) => `
  list-style: none;
  padding: 8px 20px 8px 8px;
  cursor: default;
  border-bottom: ${variant === 'bordered' ? '1px solid #000' : 'none'};
  text-align: right;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${variant === 'bordered' ? theme.palette.blue.light : 'none'};
    cursor: pointer;
  }

  &[aria-selected=true] {
    background-color: ${variant === 'bordered' ? theme.palette.blue.light : 'none'};
    color: ${variant !== 'bordered' && theme.palette.blue.light};
  }

  &.Mui-focused,
  &.Mui-focusVisible {
    background-color: ${variant === 'bordered' ? theme.palette.blue.light : 'none'};
    color: ${variant !== 'bordered' && theme.palette.blue.light};
  }

  &.Mui-focusVisible {
    border: ${theme.palette.border};

  }

  &[aria-selected=true].Mui-focused,
  &[aria-selected=true].Mui-focusVisible {
    background-color: ${variant === 'bordered' ? theme.palette.blue.light : 'none'};
    color: ${variant !== 'bordered' && theme.palette.blue.light};
  }
  `
);

const NoOptions = styled('li')`
  list-style: none;
  padding: 8px;
  cursor: default;
`;
