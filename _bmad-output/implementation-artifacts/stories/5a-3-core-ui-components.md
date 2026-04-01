---
story_number: "5a.3"
story_key: "5a-3-core-ui-components"
story_name: "Core UI Components (Button, Input, List)"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 5a.3: Core UI Components (Button, Input, List)

> **QA Note:** This story enables parallel test case development. QA can verify component rendering, prop handling, and accessibility compliance.

## 1. Description

### 1.1 User Story Statement
As a UI developer,
I want reusable Button, Input, and List components,
so that forms and lists are consistent across the application.

### 1.2 Business Context
Core UI components form the building blocks for all features. Consistent, well-tested components reduce development time and ensure uniform user experience.

### 1.3 Technical Overview
- **Components:** Button, Input, List, ListItem
- **Library:** Material UI v5 wrapped with custom styling
- **Features:** Variants, sizes, states (disabled, loading, error)
- **Accessibility:** WCAG 2.1 AA compliant, keyboard navigation

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given Button component, when rendered, then it supports variants: contained, outlined, text | Must Have | Yes |
| AC-2 | Given Button component, when loading prop is true, then it shows spinner and is disabled | Must Have | Yes |
| AC-3 | Given Input component, when rendered, then it supports text, email, password types | Must Have | Yes |
| AC-4 | Given Input component, when error prop is true, then it displays error helper text | Must Have | Yes |
| AC-5 | Given List component, when rendered with items, then ListItem shows primary/secondary text | Must Have | Yes |
| AC-6 | Given ListItem, when selected prop is true, then it shows selected state | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Accessibility:** WCAG 2.1 AA compliant (contrast, focus, keyboard)
- **Performance:** Components render in < 100ms
- **Reusability:** Works across all features without modification

## 3. Technical Specifications

### 3.1 Button Component
**apps/web/src/shared/components/ui/Button/Button.tsx:**
```typescript
import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'success';
}

export type ButtonProps = ButtonOwnProps & MuiButtonProps;

const StyledButton = styled(MuiButton)<ButtonOwnProps>(({ fullWidth }) => ({
  ...(fullWidth && { width: '100%' }),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
}));

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  color = 'primary',
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      data-testid="button-component"
      {...props}
    >
      {loading ? (
        <CircularProgress size={16} color="inherit" />
      ) : (
        <>
          {leftIcon && <span style={{ marginRight: 8 }}>{leftIcon}</span>}
          {children}
          {rightIcon && <span style={{ marginLeft: 8 }}>{rightIcon}</span>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
```

### 3.2 Input Component
**apps/web/src/shared/components/ui/Input/Input.tsx:**
```typescript
import React, { forwardRef, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

interface InputOwnProps {
  type?: InputType;
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export type InputProps = InputOwnProps & TextFieldProps;

const StyledTextField = styled(TextField)<InputOwnProps>(({ fullWidth }) => ({
  ...(fullWidth && { width: '100%' }),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  },
}));

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error = false,
      helperText,
      fullWidth = true,
      leftAdornment,
      rightAdornment,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password' && showPasswordToggle;
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <StyledTextField
        type={inputType}
        label={label}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        inputRef={ref}
        InputProps={{
          startAdornment: leftAdornment && (
            <InputAdornment position="start">{leftAdornment}</InputAdornment>
          ),
          endAdornment: (
            <>
              {rightAdornment && (
                <InputAdornment position="end">{rightAdornment}</InputAdornment>
              )}
              {isPassword && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label={showPassword ? 'hide password' : 'show password'}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
        data-testid="input-component"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

### 3.3 List Component
**apps/web/src/shared/components/ui/List/List.tsx:**
```typescript
import React from 'react';
import MuiList, { ListProps as MuiListProps } from '@mui/material/List';
import { styled } from '@mui/material/styles';

interface ListOwnProps {
  dense?: boolean;
  divider?: boolean;
}

export type ListProps = ListOwnProps & MuiListProps;

const StyledList = styled(MuiList)<ListOwnProps>(({ dense, divider }) => ({
  ...(dense && { padding: 0 }),
  ...(divider && {
    '& .MuiListItem-root': {
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
    },
  }),
}));

export const List: React.FC<ListProps> = ({
  dense = false,
  divider = false,
  children,
  ...props
}) => {
  return (
    <StyledList dense={dense} divider={divider} data-testid="list-component" {...props}>
      {children}
    </StyledList>
  );
};

export default List;
```

### 3.4 ListItem Component
**apps/web/src/shared/components/ui/List/ListItem.tsx:**
```typescript
import React from 'react';
import MuiListItem, { ListItemProps as MuiListItemProps } from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';

interface ListItemOwnProps {
  primary?: string;
  secondary?: string;
  selected?: boolean;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  colorIndicator?: string;
}

export type ListItemProps = ListItemOwnProps & Partial<MuiListItemProps>;

const StyledListItem = styled(MuiListItem)<ListItemOwnProps>(({ selected, colorIndicator }) => ({
  ...(selected && {
    backgroundColor: 'action.selected',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  }),
  ...(colorIndicator && {
    borderLeft: `4px solid ${colorIndicator}`,
  }),
  cursor: 'pointer',
  borderRadius: 8,
  marginBottom: 4,
  '&:hover': {
    backgroundColor: 'action.hover',
  },
}));

export const ListItem: React.FC<ListItemProps> = ({
  primary,
  secondary,
  selected = false,
  avatar,
  icon,
  onClick,
  colorIndicator,
  children,
  ...props
}) => {
  return (
    <StyledListItem
      button
      selected={selected}
      onClick={onClick}
      colorIndicator={colorIndicator}
      data-testid="list-item-component"
      {...props}
    >
      {avatar && <ListItemAvatar>{avatar}</ListItemAvatar>}
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{ variant: 'body1', fontWeight: selected ? 600 : 400 }}
        secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
      />
      {children}
    </StyledListItem>
  );
};

export default ListItem;
```

### 3.5 Component Exports
**apps/web/src/shared/components/ui/index.ts:**
```typescript
// Button
export { Button } from './Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button';

// Input
export { Input } from './Input/Input';
export type { InputProps, InputType } from './Input/Input';

// List
export { List } from './List/List';
export type { ListProps } from './List/List';

// ListItem
export { ListItem } from './List/ListItem';
export type { ListItemProps } from './List/ListItem';
```

## 4. Setup Instructions

### 4.1 File Structure
```
apps/web/src/shared/components/ui/
├── index.ts
├── Button/
│   ├── Button.tsx
│   ├── Button.spec.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.spec.tsx
│   └── index.ts
└── List/
    ├── List.tsx
    ├── List.spec.tsx
    ├── ListItem.tsx
    ├── ListItem.spec.tsx
    └── index.ts
```

### 4.2 Usage Examples
```typescript
import { Button, Input, List, ListItem } from '@tidy/web/shared/components/ui';

// Button examples
<Button variant="contained" color="primary">Save</Button>
<Button variant="outlined" loading>Loading</Button>
<Button variant="text" leftIcon={<Icon />}>Cancel</Button>

// Input examples
<Input label="Email" type="email" error helperText="Invalid email" />
<Input label="Password" type="password" showPasswordToggle />
<Input label="Search" leftAdornment={<SearchIcon />} />

// List examples
<List divider>
  <ListItem primary="Item 1" secondary="Description" selected />
  <ListItem primary="Item 2" colorIndicator="#FF5733" />
  <ListItem primary="Item 3" icon={<FolderIcon />} />
</List>
```

## 5. Validation Checklist

### 5.1 Component Validation
| Check | Component | Test | Expected Result |
|-------|-----------|------|-----------------|
| Variants | Button | Render all variants | contained, outlined, text display correctly |
| Loading | Button | Set loading=true | Spinner shows, button disabled |
| Types | Input | Test all types | text, email, password work |
| Error | Input | Set error=true | Red border, helper text shown |
| Password toggle | Input | showPasswordToggle=true | Eye icon toggles visibility |
| Selected | ListItem | Set selected=true | Background highlights |
| Color indicator | ListItem | Set colorIndicator | Left border shows color |

### 5.2 Accessibility Validation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Focus visible | Tab to component | Focus ring appears |
| Keyboard navigation | Enter/Space on Button | Click triggers |
| Screen reader | Use NVDA/VoiceOver | Labels announced correctly |
| Contrast | Check colors | WCAG 2.1 AA compliant |

### 5.3 Component Test Example
```typescript
// apps/web/src/shared/components/ui/Button/Button.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders left icon', () => {
    render(<Button leftIcon={<span data-testid="icon">Icon</span>}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

// apps/web/src/shared/components/ui/Input/Input.spec.tsx
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Input label="Email" error helperText="Invalid" />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<Input label="Password" type="password" showPasswordToggle />);
    const toggleButton = screen.getByLabelText('show password');
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText('hide password')).toBeInTheDocument();
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Story 5a.1: Material UI Theme (theme configured)
- Story 5a.2: Master-Slave Layout (layout structure)

### 6.2 External Dependencies
- @mui/material@5.x
- @mui/icons-material@5.x

## 7. Technical Considerations

### 7.1 Component Design Principles
- **Composability:** Components work together seamlessly
- **Flexibility:** Props for common customizations
- **Consistency:** Uniform styling across all components
- **Accessibility:** Built-in ARIA attributes, keyboard support

### 7.2 Styling Approach
- Use Material UI's `styled()` for customizations
- Leverage theme tokens for colors, spacing, typography
- Maintain MUI component APIs for familiarity

### 7.3 Performance
- Use React.memo for expensive components
- Forward refs to avoid unnecessary wrappers
- Lazy load icons to reduce bundle size

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Build and verify components
npx nx build web

# Run component tests
npx nx test web --testPathPattern="shared/components/ui"
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Button not showing loading | Check loading prop and CircularProgress |
| Input password toggle not working | Verify showPasswordToggle prop |
| ListItem not clickable | Ensure button prop is set |
| Styles not applying | Check styled() configuration |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/web/src/shared/components/ui/Button/Button.tsx` | CREATE | Button component | ~60 |
| `apps/web/src/shared/components/ui/Button/Button.spec.tsx` | CREATE | Button tests | ~40 |
| `apps/web/src/shared/components/ui/Input/Input.tsx` | CREATE | Input component | ~80 |
| `apps/web/src/shared/components/ui/Input/Input.spec.tsx` | CREATE | Input tests | ~50 |
| `apps/web/src/shared/components/ui/List/List.tsx` | CREATE | List component | ~30 |
| `apps/web/src/shared/components/ui/List/ListItem.tsx` | CREATE | ListItem component | ~60 |
| `apps/web/src/shared/components/ui/index.ts` | CREATE | Barrel export | ~20 |

### Implementation Notes
- Wrap MUI components for consistent API
- Add loading state to Button
- Password visibility toggle in Input
- Color indicator support in ListItem

### Code Review Checklist
- [ ] All variants/sizes work correctly
- [ ] Loading state functional
- [ ] Error states display properly
- [ ] Keyboard navigation works
- [ ] Accessibility attributes present
- [ ] Tests passing

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#frontend-architecture)
- [Story 5a.1: Material UI Theme](./5a-1-material-ui-theme.md)
- [Material UI Button](https://mui.com/material-ui/react-button/)
- [Material UI TextField](https://mui.com/material-ui/react-text-field/)
- [Material UI List](https://mui.com/material-ui/react-list/)
