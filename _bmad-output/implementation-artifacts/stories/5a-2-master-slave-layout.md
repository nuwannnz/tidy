---
story_number: "5a.2"
story_key: "5a-2-master-slave-layout"
story_name: "Master-Slave Layout Shell"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 5a.2: Master-Slave Layout Shell

> **QA Note:** This story enables parallel test case development. QA can verify layout structure, responsive behavior, and navigation flow.

## 1. Description

### 1.1 User Story Statement
As a user,
I want a master-slave layout with left project pane and right content pane,
so that I can navigate projects and view details in a structured interface.

### 1.2 Business Context
The master-slave layout is the primary navigation pattern for tidy. It provides intuitive project navigation (left pane) with detailed content viewing (right pane), establishing the core user experience.

### 1.3 Technical Overview
- **Layout:** Left sidebar (250-300px) + right main content area
- **Components:** Material UI Drawer for sidebar, Box/Main for content
- **Responsive:** Sidebar collapses to drawer on mobile (<768px)
- **Routing:** Integrated with React Router for navigation

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am logged in, when app loads, then layout displays left sidebar (250-300px) for project list | Must Have | Yes |
| AC-2 | Given I am viewing the layout, when I resize browser, then layout adapts to available space | Must Have | Yes |
| AC-3 | Given I am on mobile (<768px), when layout renders, then sidebar becomes a drawer | Must Have | Yes |
| AC-4 | Given the layout is rendered, when I inspect structure, then it uses Material UI Drawer and AppBar | Must Have | Yes |
| AC-5 | Given I click sidebar toggle, when on mobile, then drawer opens/closes | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** Layout renders in < 500ms
- **Accessibility:** Keyboard navigation works (Tab, Escape)
- **Responsiveness:** Works on desktop (≥1024px), tablet (768-1023px), mobile (<768px)

## 3. Technical Specifications

### 3.1 Layout Component Structure
**apps/web/src/shared/components/layout/AppLayout.tsx:**
```typescript
import React, { useState } from 'react';
import { styled, useTheme, Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const drawerWidth = 280;
const collapsedWidth = 60;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : `-${drawerWidth}px`,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Navbar />
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Sidebar />
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        {children || <Outlet />}
      </Main>
    </Box>
  );
};

export default AppLayout;
```

### 3.2 Sidebar Component
**apps/web/src/shared/components/layout/Sidebar.tsx:**
```typescript
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
      data-testid="project-list-sidebar"
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Projects
        </Typography>
        <List>
          {/* Project list will be populated by Story 2.2 */}
          <Typography variant="body2" color="text.secondary">
            No projects yet
          </Typography>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
```

### 3.3 Navbar Component
**apps/web/src/shared/components/layout/Navbar.tsx:**
```typescript
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      data-testid="navbar"
    >
      <Typography variant="h6" noWrap component="div">
        tidy
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button color="inherit" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="contained" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
```

### 3.4 Routing Configuration
**apps/web/src/routes/AppRoutes.tsx:**
```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../shared/components/layout/AppLayout';
import Dashboard from '../features/dashboard/Dashboard';
import ProjectDetail from '../features/projects/ProjectDetail';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
```

### 3.5 Responsive Breakpoints
```typescript
// Material UI default breakpoints
{
  xs: '0px',      // Mobile
  sm: '600px',    // Tablet small
  md: '900px',    // Tablet large / Desktop small
  lg: '1200px',   // Desktop
  xl: '1536px'    // Desktop large
}

// Layout behavior:
// - < 900px (md): Sidebar becomes temporary drawer
// - ≥ 900px: Sidebar is persistent
```

## 4. Setup Instructions

### 4.1 Installation Commands
```bash
# Install React Router (if not already installed)
npm install react-router-dom@6

# Install Material UI icons
npm install @mui/icons-material@5
```

### 4.2 File Structure
```
apps/web/src/shared/components/layout/
├── AppLayout.tsx       # Main layout shell
├── Sidebar.tsx         # Left sidebar (project list)
├── Navbar.tsx          # Top navigation bar
└── index.ts            # Barrel export
```

### 4.3 Integration with App
**apps/web/src/main.tsx:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';
import { AppRoutes } from './routes/AppRoutes';
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## 5. Validation Checklist

### 5.1 Layout Validation
| Check | Command/Test | Expected Result |
|-------|--------------|-----------------|
| Sidebar renders | App loads | Left sidebar visible (280px) |
| Main content area | App loads | Right pane displays content |
| AppBar fixed | Scroll page | AppBar stays at top |
| Responsive (desktop) | Width ≥900px | Sidebar persistent |
| Responsive (mobile) | Width <900px | Sidebar becomes drawer |
| Drawer toggle | Click menu icon | Drawer opens/closes |

### 5.2 Keyboard Navigation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Tab navigation | Press Tab | Focus moves through interactive elements |
| Escape key | Press Escape (mobile) | Drawer closes |
| Focus visible | Tab through elements | Focus ring visible |

### 5.3 Component Test Example
```typescript
// apps/web/src/shared/components/layout/AppLayout.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../styles/theme';
import AppLayout from './AppLayout';

describe('AppLayout', () => {
  it('renders layout with sidebar and main content', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AppLayout>
            <div data-testid="main-content">Content</div>
          </AppLayout>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('project-list-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('toggles drawer on mobile', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AppLayout />
        </ThemeProvider>
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText('open drawer');
    fireEvent.click(menuButton);
    // Drawer should open
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Story 5a.1: Material UI Theme (theme configured)
- Story 6.1.1: Nx Monorepo Workspace (apps/web exists)

### 6.2 External Dependencies
- react-router-dom@6.x
- @mui/material@5.x
- @mui/icons-material@5.x

## 7. Technical Considerations

### 7.1 Layout Patterns
- **Persistent drawer (desktop):** Always visible, content adjusts
- **Temporary drawer (mobile):** Overlays content, dismissible
- **Responsive breakpoint:** 900px (md) threshold

### 7.2 Accessibility
- Use semantic HTML (nav, main, header)
- ARIA labels for interactive elements
- Focus management when drawer opens/closes
- Skip links for keyboard users

### 7.3 Performance
- Lazy load sidebar content (projects list)
- Use CSS transitions for smooth animations
- Avoid unnecessary re-renders with React.memo

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Build and verify
npx nx build web

# Check for layout-related errors
# Verify responsive behavior in browser DevTools
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Sidebar not visible | Check Drawer variant and open state |
| Content overlaps sidebar | Verify Main component marginLeft |
| Drawer doesn't close on mobile | Check onClose handler |
| AppBar z-index issue | Adjust zIndex in AppBar sx prop |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/web/src/shared/components/layout/AppLayout.tsx` | CREATE | Main layout shell | ~100 |
| `apps/web/src/shared/components/layout/Sidebar.tsx` | CREATE | Left sidebar component | ~30 |
| `apps/web/src/shared/components/layout/Navbar.tsx` | CREATE | Top navbar component | ~30 |
| `apps/web/src/shared/components/layout/index.ts` | CREATE | Barrel export | ~5 |
| `apps/web/src/routes/AppRoutes.tsx` | MODIFY | Add layout routes | ~30 |
| `apps/web/src/main.tsx` | MODIFY | Wrap with BrowserRouter | ~15 |
| `apps/web/src/shared/components/layout/AppLayout.spec.tsx` | CREATE | Layout tests | ~40 |

### Implementation Notes
- Use 280px drawer width (comfortable for project list)
- Responsive breakpoint at 900px (md)
- Persistent drawer on desktop, temporary on mobile

### Code Review Checklist
- [ ] Layout renders correctly on all screen sizes
- [ ] Drawer toggle works on mobile
- [ ] Keyboard navigation functional
- [ ] AppBar stays fixed on scroll
- [ ] Main content area adjusts to sidebar
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
- [Material UI Drawer](https://mui.com/material-ui/components/drawer/)
- [React Router](https://reactrouter.com)
