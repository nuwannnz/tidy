---
story_number: "5a.5"
story_key: "5a-5-keyboard-navigation"
story_name: "Keyboard Navigation Foundation"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 5a.5: Keyboard Navigation Foundation

> **QA Note:** This story enables parallel test case development. QA can verify keyboard navigation patterns, focus management, and accessibility compliance across the application.

## 1. Description

### 1.1 User Story Statement
As a keyboard user,
I want basic keyboard navigation throughout the UI,
so that I can use the application without a mouse.

### 1.2 Business Context
Keyboard accessibility is essential for users with motor impairments and power users. WCAG 2.1 AA compliance requires full keyboard navigability, making this a legal and ethical requirement.

### 1.3 Technical Overview
- **Focus Management:** Visible focus indicators, logical tab order
- **Keyboard Shortcuts:** Tab, Enter, Escape, Arrow keys
- **Skip Links:** Bypass repetitive navigation
- **Focus Trapping:** Modal dialogs trap focus appropriately

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am using the application, when I press Tab, then focus moves to next interactive element | Must Have | Yes |
| AC-2 | Given any interactive element is focused, when inspected, then focus is clearly visible with focus ring | Must Have | Yes |
| AC-3 | Given I am in the project list, when I press Arrow Up/Down, then focus moves between project items | Should Have | Yes |
| AC-4 | Given a modal is open, when I press Escape, then modal closes and focus returns to trigger | Must Have | Yes |
| AC-5 | Given I am navigating the app, when I inspect any interactive element, then it has proper tabIndex and role attributes | Must Have | Yes |
| AC-6 | Given I am on any page, when I press Tab from start, then I can reach skip link first | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Accessibility:** WCAG 2.1 AA compliant (focus visible, logical order, keyboard operable)
- **Performance:** Focus changes instant (< 100ms)
- **Consistency:** Same keyboard patterns across all pages

## 3. Technical Specifications

### 3.1 Focus Styles Configuration
**apps/web/src/styles/focusStyles.ts:**
```typescript
import { CSSObject } from '@mui/material/styles';

/**
 * Visible focus outline for keyboard navigation
 * Applied to elements when focused via keyboard
 */
export const focusVisible: CSSObject = {
  outline: '2px solid',
  outlineColor: 'primary.main',
  outlineOffset: 2,
  borderRadius: 4,
};

/**
 * Focus visible pseudo-class selector
 * Only shows focus outline when navigating via keyboard
 */
export const focusVisibleSelector = {
  '&:focus-visible': focusVisible,
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
};

/**
 * Apply focus visible styles to MUI components
 */
export const applyFocusStyles = (theme: any) => ({
  ...focusVisibleSelector,
  '& .MuiButton-root': {
    ...focusVisibleSelector,
  },
  '& .MuiIconButton-root': {
    ...focusVisibleSelector,
  },
  '& .MuiInputBase-root': {
    ...focusVisibleSelector,
  },
  '& .MuiListItem-button': {
    ...focusVisibleSelector,
  },
});
```

### 3.2 Skip Link Component
**apps/web/src/shared/components/layout/SkipLink.tsx:**
```typescript
import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const SkipLinkButton = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: '-9999px',
  top: 0,
  zIndex: 9999,
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  '&:focus': {
    left: theme.spacing(2),
    top: theme.spacing(2),
  },
}));

export const SkipLink: React.FC = () => {
  return (
    <SkipLinkButton href="#main-content" data-testid="skip-link">
      Skip to main content
    </SkipLinkButton>
  );
};

export default SkipLink;
```

### 3.3 Keyboard Navigation Hook
**apps/web/src/shared/hooks/useKeyboardNavigation.ts:**
```typescript
import { useCallback, useEffect, useRef } from 'react';

interface UseKeyboardNavigationProps {
  itemCount: number;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  onEnter?: (index: number) => void;
}

export const useKeyboardNavigation = ({
  itemCount,
  onSelect,
  onEscape,
  onEnter,
}: UseKeyboardNavigationProps) => {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!containerRef.current) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
          break;

        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
          break;

        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;

        case 'End':
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;

        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && onEnter) {
            onEnter(focusedIndex);
          }
          break;

        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && onSelect) {
            onSelect(focusedIndex);
          }
          break;

        case 'Escape':
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          break;

        default:
          break;
      }
    },
    [itemCount, focusedIndex, onSelect, onEnter, onEscape]
  );

  // Focus the focused item
  useEffect(() => {
    if (focusedIndex >= 0 && containerRef.current) {
      const focusedElement = containerRef.current.querySelectorAll('[role="option"]')[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        focusedElement.focus();
      }
    }
  }, [focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    containerRef,
    handleKeyDown,
  };
};

export default useKeyboardNavigation;
```

### 3.4 Focus Trap for Modals
**apps/web/src/shared/components/ui/Modal/FocusTrap.tsx:**
```typescript
import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  onEscape,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Store previous focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      // Restore previous focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Shift + Tab
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);

  return (
    <div ref={containerRef} data-testid="focus-trap">
      {children}
    </div>
  );
};

export default FocusTrap;
```

### 3.5 App Layout with Keyboard Support
**apps/web/src/shared/components/layout/AppLayout.tsx (updated):**
```typescript
// Add to existing AppLayout component
import SkipLink from './SkipLink';

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // ... existing code

  return (
    <Box sx={{ display: 'flex' }}>
      <SkipLink />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* ... existing code */}
        </Toolbar>
      </AppBar>

      {/* ... existing drawer code */}

      <Main open={open}>
        <DrawerHeader />
        <Box id="main-content" data-testid="main-content">
          {children || <Outlet />}
        </Box>
      </Main>
    </Box>
  );
};
```

## 4. Setup Instructions

### 4.1 File Structure
```
apps/web/src/shared/
├── hooks/
│   ├── useKeyboardNavigation.ts
│   └── useKeyboardNavigation.spec.ts
└── components/
    ├── layout/
    │   ├── SkipLink.tsx
    │   └── AppLayout.tsx (updated)
    └── ui/
        └── Modal/
            ├── FocusTrap.tsx
            └── FocusTrap.spec.tsx
```

### 4.2 Global Focus Styles
**apps/web/src/styles/theme.ts (add):**
```typescript
import { focusVisible } from './focusStyles';

export const theme = createTheme({
  // ... existing config
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          ...focusVisible,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          ...focusVisible,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          ...focusVisible,
        },
      },
    },
  },
});
```

## 5. Validation Checklist

### 5.1 Keyboard Navigation Validation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Tab navigation | Press Tab repeatedly | Focus moves through all interactive elements |
| Focus visible | Tab to any element | Clear focus ring appears |
| Skip link | Press Tab from page start | "Skip to main content" appears |
| Arrow navigation | In project list, use Arrow Up/Down | Focus moves between items |
| Escape key | Open modal, press Escape | Modal closes, focus restored |
| Enter/Space | Focus button, press Enter/Space | Button activates |

### 5.2 Accessibility Validation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Focus order | Tab through page | Logical reading order |
| Focus trapped | Open modal, Tab repeatedly | Focus stays within modal |
| Focus restored | Close modal | Focus returns to trigger element |
| Screen reader | Use NVDA/VoiceOver | Focus changes announced |
| Skip link | Activate skip link | Focus jumps to main content |

### 5.3 Test Example
```typescript
// apps/web/src/shared/hooks/useKeyboardNavigation.spec.ts
import { renderHook, fireEvent } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  it('navigates down with arrow key', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation({ itemCount: 5 })
    );

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(result.current.focusedIndex).toBe(0);

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(result.current.focusedIndex).toBe(1);
  });

  it('wraps around at boundaries', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation({ itemCount: 3 })
    );

    // Start at end
    result.current.setFocusedIndex(2);

    // Arrow down should wrap to start
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(result.current.focusedIndex).toBe(0);
  });

  it('calls onEnter when Enter pressed', () => {
    const handleEnter = jest.fn();
    const { result } = renderHook(() =>
      useKeyboardNavigation({ itemCount: 5, onEnter: handleEnter })
    );

    result.current.setFocusedIndex(2);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(handleEnter).toHaveBeenCalledWith(2);
  });

  it('calls onEscape when Escape pressed', () => {
    const handleEscape = jest.fn();
    renderHook(() =>
      useKeyboardNavigation({ itemCount: 5, onEscape: handleEscape })
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleEscape).toHaveBeenCalled();
  });
});

// apps/web/src/shared/components/ui/Modal/FocusTrap.spec.tsx
import { render, screen } from '@testing-library/react';
import { FocusTrap } from './FocusTrap';

describe('FocusTrap', () => {
  it('traps focus within container', () => {
    render(
      <FocusTrap isActive={true}>
        <button data-testid="btn1">Button 1</button>
        <button data-testid="btn2">Button 2</button>
        <button data-testid="btn3">Button 3</button>
      </FocusTrap>
    );

    // First button should be focused
    expect(screen.getByTestId('btn1')).toHaveFocus();
  });

  it('restores focus on deactivate', () => {
    const { rerender } = render(
      <>
        <button data-testid="trigger">Trigger</button>
        <FocusTrap isActive={true}>
          <button data-testid="inside">Inside</button>
        </FocusTrap>
      </>
    );

    rerender(
      <>
        <button data-testid="trigger">Trigger</button>
        <FocusTrap isActive={false}>
          <button data-testid="inside">Inside</button>
        </FocusTrap>
      </>
    );

    // Focus should return to trigger
    expect(screen.getByTestId('trigger')).toHaveFocus();
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Story 5a.1: Material UI Theme (focus styles configured)
- Story 5a.2: Master-Slave Layout (layout structure)
- Story 5a.3: Core UI Components (interactive elements)

### 6.2 External Dependencies
- @mui/material@5.x
- @testing-library/react@14.x (for tests)

## 7. Technical Considerations

### 7.1 Focus Management Patterns
- **Sequential focus:** Tab moves through elements in DOM order
- **Roving tabindex:** Arrow keys move focus within component groups
- **Focus trapping:** Modals keep focus contained
- **Focus restoration:** Return focus to trigger on close

### 7.2 WCAG 2.1 Requirements
| Requirement | Level | Implementation |
|-------------|-------|----------------|
| 2.1.1 Keyboard | A | All functionality via keyboard |
| 2.1.2 No Keyboard Trap | A | Can exit component with keyboard |
| 2.4.3 Focus Order | A | Logical focus sequence |
| 2.4.7 Focus Visible | AA | Clear focus indicator |

### 7.3 Browser Compatibility
- `:focus-visible` supported in all modern browsers
- Fallback to `:focus` for older browsers
- Test in Chrome, Firefox, Safari, Edge

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Build and verify
npx nx build web

# Run accessibility audit (optional)
npm install -g @axe-core/cli
axe http://localhost:3000
```

### 8.2 Manual Testing Checklist
```
□ Tab through entire application
□ All interactive elements reachable
□ Focus visible on all elements
□ Skip link works
□ Arrow keys work in lists
□ Escape closes modals
□ Focus trapped in modals
□ Focus restored after modal close
```

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/web/src/styles/focusStyles.ts` | CREATE | Focus style definitions | ~30 |
| `apps/web/src/shared/components/layout/SkipLink.tsx` | CREATE | Skip to content link | ~25 |
| `apps/web/src/shared/hooks/useKeyboardNavigation.ts` | CREATE | Keyboard navigation hook | ~80 |
| `apps/web/src/shared/hooks/useKeyboardNavigation.spec.ts` | CREATE | Hook tests | ~60 |
| `apps/web/src/shared/components/ui/Modal/FocusTrap.tsx` | CREATE | Focus trap component | ~70 |
| `apps/web/src/shared/components/ui/Modal/FocusTrap.spec.tsx` | CREATE | Focus trap tests | ~50 |
| `apps/web/src/styles/theme.ts` | MODIFY | Add focus styles to components | ~20 |
| `apps/web/src/shared/components/layout/AppLayout.tsx` | MODIFY | Add skip link | ~10 |

### Implementation Notes
- Use `:focus-visible` for keyboard-only focus
- Roving tabindex for list navigation
- Focus trap prevents escape from modals
- Skip link for quick access to content

### Code Review Checklist
- [ ] Focus visible on all interactive elements
- [ ] Tab order is logical
- [ ] Arrow keys work in lists
- [ ] Escape closes modals
- [ ] Focus trapped in modals
- [ ] Focus restored after close
- [ ] Skip link functional
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
- [Story 5a.2: Master-Slave Layout](./5a-2-master-slave-layout.md)
- [WCAG 2.1 Keyboard Accessibility](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1#keyboard-accessible)
- [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
