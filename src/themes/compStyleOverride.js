export default function componentStyleOverrides(theme) {
  const borderRadius = 8;
  const isDarkMode = theme.mode === 'dark';
  /*   const backgroundGradient = isDarkMode
    ? `linear-gradient(38deg, rgba(23,41,47,1) 0%, rgba(21,32,43,1) 50%)`
    : `linear-gradient(90deg, rgba(230,230,230,1) 9%, rgba(250,250,250,1) 100%)`; */
  //? `linear-gradient(120deg, rgba(18,18,18,1) 0%, rgba(40,40,40,1) 100%)`
  //;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.background
          //backgroundImage: backgroundGradient
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiButton: {
      disableRipple: true,
      styleOverrides: {
        root: {
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': {
            //backgroundColor: 'white',
            boxShadow: 'none'
          },
          boxShadow: 'none'
        }
      }
    },
    MuiIconButton: {
      disableRipple: true,
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        rounded: {
          borderRadius: `${borderRadius}px`
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textDark,
          padding: '24px'
        },
        title: {
          fontSize: '1.125rem'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          paddingTop: '10px',
          paddingBottom: '10px',
          '&.Mui-selected': {
            color: theme.menuSelected,
            //backgroundColor: theme.menuSelectedBack,
            '&:hover': {
              //backgroundColor: theme.menuSelectedBack
              backgroundColor: 'transparent'
            },
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected
            }
          },
          '&:hover': {
            //backgroundColor: theme.menuSelectedBack,
            backgroundColor: 'transparent',
            color: theme.menuSelected,
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected
            }
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          minWidth: '36px'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: isDarkMode ? theme.colors?.grey300 : theme.textPrimary,
          '&::placeholder': {
            color: theme.darkTextSecondary,
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: isDarkMode ? theme.colors?.grey900 : theme.colors?.grey50,
          borderRadius: `${borderRadius}px`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDarkMode ? theme.colors?.grey400 : theme.colors?.grey300
          },
          '&:hover $notchedOutline': {
            borderColor: theme.colors?.primaryLight
          },
          '&.MuiInputBase-multiline': {
            padding: 1
          }
        },
        input: {
          fontWeight: 500,
          background: isDarkMode ? theme.colors?.grey900 : theme.colors?.grey50,
          padding: '15.5px 14px',
          borderRadius: `${borderRadius}px`,
          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',
            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0
            }
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          borderRadius: `${borderRadius}px`
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: theme.colors?.grey300
          }
        },
        mark: {
          backgroundColor: theme.paper,
          width: '4px'
        },
        valueLabel: {
          color: theme?.colors?.primaryLight
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: 1
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryDark,
          background: theme.colors?.primary200
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-deletable .MuiChip-deleteIcon': {
            color: 'inherit'
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: theme.colors?.grey700
        }
      }
    }
  };
}
