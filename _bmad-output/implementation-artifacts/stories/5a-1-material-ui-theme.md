---
story_number: "5a.1"
story_key: "5a-1-material-ui-theme"
story_name: "Material UI Theme & Design Tokens"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 5a.1: Material UI Theme & Design Tokens

> **QA Note:** This story enables parallel test case development. QA can verify theme configuration, design token values, and component styling consistency.

## 1. Description

### 1.1 User Story Statement
As a UI developer,
I want a Material UI theme with design tokens,
so that all components have consistent colors, typography, and spacing.

### 1.2 Business Context
A well-defined design system ensures visual consistency across the application. Design tokens enable theming, maintainability, and brand coherence as the product scales.

### 1.3 Technical Overview
- **Library:** Material UI v5 with Emotion
- **Approach:** Custom theme with design tokens (colors, typography, spacing)
- **Integration:** ThemeProvider wraps entire application
- **Usage:** Tokens accessible via `theme.palette`, `theme.typography`, `theme.spacing`

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given the theme is configured, when I access `theme.palette.primary.main`, then I receive the primary color | Must Have | Yes |
| AC-2 | Given the theme is configured, when I access `theme.typography.h4`, then I receive h4 typography styles | Must Have | Yes |
| AC-3 | Given the theme is configured, when I use `theme.spacing(3)`, then I receive 24px (4px base unit) | Must Have | Yes |
| AC-4 | Given Material UI components are used, when rendered, then they apply the custom theme by default | Must Have | Yes |
| AC-5 | Given dark mode is supported, when toggled, then theme colors update accordingly | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** Theme loads in < 100ms
- **Accessibility:** Color contrast meets WCAG 2.1 AA standards
- **Maintainability:** Design tokens documented and organized

## 3. Technical Specifications

### 3.1 Theme Configuration
**apps/web/src/styles/theme.ts:**
```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9C27B0',
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    common: {
      white: '#FFFFFF',
      black: '#000000',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
  },
  spacing: 4, // 4px base unit
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    // ... shadows 3-24
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
};

export const theme = createTheme(themeOptions);

// Dark theme variant
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
});
```

### 3.2 Theme Provider Setup
**apps/web/src/app/App.tsx:**
```typescript
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}

export default App;
```

### 3.3 Using Theme in Components
**Example Component:**
```typescript
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

function ExampleComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: theme.spacing(3), // 24px padding
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography variant="h4" sx={{ mb: theme.spacing(2) }}>
        Hello World
      </Typography>
    </Box>
  );
}
```

### 3.4 Design Token Reference
**Color Palette:**
| Token | Value | Usage |
|-------|-------|-------|
| `palette.primary.main` | #1976D2 | Primary actions, buttons |
| `palette.secondary.main` | #9C27B0 | Secondary actions |
| `palette.error.main` | #D32F2F | Error states, destructive actions |
| `palette.warning.main` | #ED6C02 | Warning states |
| `palette.success.main` | #2E7D32 | Success states |
| `palette.grey.500` | #9E9E9E | Neutral text, borders |
| `palette.background.default` | #FAFAFA | Page background |
| `palette.background.paper` | #FFFFFF | Card/surface background |

**Typography Scale:**
| Token | Font Size | Weight | Usage |
|-------|-----------|--------|-------|
| `typography.h1` | 2.5rem | 700 | Page titles |
| `typography.h2` | 2rem | 700 | Section titles |
| `typography.h3` | 1.75rem | 600 | Subsection titles |
| `typography.h4` | 1.5rem | 600 | Card titles |
| `typography.h5` | 1.25rem | 600 | Group titles |
| `typography.h6` | 1rem | 600 | Item titles |
| `typography.body1` | 1rem | 400 | Primary text |
| `typography.body2` | 0.875rem | 400 | Secondary text |
| `typography.button` | 0.875rem | 500 | Button text |
| `typography.caption` | 0.75rem | 400 | Helper text |

**Spacing Scale (4px base unit):**
| Token | Value | Usage |
|-------|-------|-------|
| `spacing(1)` | 4px | Tight spacing |
| `spacing(2)` | 8px | Small gaps |
| `spacing(3)` | 12px | Standard gaps |
| `spacing(4)` | 16px | Medium gaps |
| `spacing(6)` | 24px | Large gaps |
| `spacing(8)` | 32px | XL gaps |
| `spacing(12)` | 48px | XXL gaps |

## 4. Setup Instructions

### 4.1 Installation Commands
```bash
# Install Material UI and Emotion
npm install @mui/material@5 @emotion/react@11 @emotion/styled@11

# Install Material UI icons (optional)
npm install @mui/icons-material@5

# Install Inter font (optional, for typography)
# Add to index.html:
# <link rel="preconnect" href="https://fonts.googleapis.com">
# <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 4.2 Verification Commands
```bash
# Start dev server
npm run dev:web

# Check for TypeScript errors
npx nx build web
```

## 5. Validation Checklist

### 5.1 Theme Validation
| Check | Command/Test | Expected Result |
|-------|--------------|-----------------|
| Theme loads | App renders | No console errors |
| Primary color | Inspect button | Uses #1976D2 |
| Typography | Check h1-h6 | Correct font sizes |
| Spacing | Measure padding | 4px base unit |
| Dark mode | Toggle theme | Colors invert correctly |
| Border radius | Check components | 8px default |

### 5.2 Accessibility Validation
```bash
# Use browser DevTools or axe DevTools extension
# Check color contrast ratios meet WCAG 2.1 AA
# - Normal text: 4.5:1 minimum
# - Large text: 3:1 minimum
# - UI components: 3:1 minimum
```

### 5.3 Component Integration Test
```typescript
// apps/web/src/styles/theme.spec.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Button, Typography, Box } from '@mui/material';

describe('Theme', () => {
  it('applies primary color to button', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button>Test</Button>
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: rgb(25, 118, 210)');
  });

  it('applies typography styles', () => {
    render(
      <ThemeProvider theme={theme}>
        <Typography variant="h4">Heading</Typography>
      </ThemeProvider>
    );
    const heading = screen.getByText('Heading');
    expect(heading).toHaveStyle('font-size: 1.5rem');
  });

  it('uses 4px spacing base unit', () => {
    render(
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3 }}>Content</Box>
      </ThemeProvider>
    );
    const box = screen.getByText('Content').parentElement;
    expect(box).toHaveStyle('padding: 12px');
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Story 6.1.1: Nx Monorepo Workspace (apps/web exists)
- Story 6.1.3: Code Quality Tooling (testing framework)

### 6.2 External Dependencies
- @mui/material@5.x
- @emotion/react@11.x
- @emotion/styled@11.x
- @mui/icons-material@5.x (optional)

## 7. Technical Considerations

### 7.1 Theme Customization
- Override default Material UI styles via `components.styleOverrides`
- Set default props via `components.defaultProps`
- Extend typography with custom font families
- Customize shadows for consistent depth

### 7.2 Dark Mode Support
- Use `palette.mode: 'dark'` for dark theme
- Toggle via context/state management
- Persist preference in localStorage

### 7.3 Performance Optimization
- Create theme object outside component (avoid recreation on render)
- Use `useMemo` if theme depends on dynamic values
- CssBaseline normalizes styles efficiently

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Build web app
npx nx build web

# Verify no theme-related errors in build output
# Check dist/apps/web for bundled theme
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Theme not applying | Ensure ThemeProvider wraps component tree |
| Colors look wrong | Check palette configuration values |
| Typography not loading | Verify font imports in index.html |
| Spacing inconsistent | Confirm spacing base unit (4px) |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/web/src/styles/theme.ts` | CREATE | Material UI theme configuration | ~150 |
| `apps/web/src/app/App.tsx` | MODIFY | Wrap with ThemeProvider | ~20 |
| `apps/web/src/styles/theme.spec.tsx` | CREATE | Theme unit tests | ~50 |
| `apps/web/src/index.html` | MODIFY | Add Google Fonts link | ~5 |

### Implementation Notes
- Use 4px base unit for spacing (Material UI default)
- Ensure WCAG 2.1 AA contrast compliance
- Document design tokens for team reference

### Code Review Checklist
- [ ] Theme configuration complete (colors, typography, spacing)
- [ ] ThemeProvider wraps app root
- [ ] CssBaseline included
- [ ] Design tokens documented
- [ ] Dark theme variant configured
- [ ] Component overrides applied
- [ ] Tests passing

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#frontend-architecture)
- [Material UI Theme Documentation](https://mui.com/material-ui/customization/theme/)
- [Material UI Design Tokens](https://mui.com/material-ui/customization/design-tokens/)
- [WCAG 2.1 AA Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
