---
story_number: "5a.4"
story_key: "5a-4-color-picker"
story_name: "Color Picker Component"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 5a.4: Color Picker Component

> **QA Note:** This story enables parallel test case development. QA can verify color selection, keyboard navigation, and accessibility compliance.

## 1. Description

### 1.1 User Story Statement
As a user,
I want a color picker for selecting project colors,
so that I can visually identify my projects.

### 1.2 Business Context
Color-coded projects enable quick visual identification in the project list. A simple, accessible color picker improves the project creation experience.

### 1.3 Technical Overview
- **Component:** Custom color picker with predefined palette
- **Colors:** 8-12 predefined colors for consistency
- **Interaction:** Click or keyboard selection
- **Accessibility:** WCAG 2.1 AA compliant, full keyboard support

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given color picker is open, when rendered, then 8-12 predefined colors are displayed | Must Have | Yes |
| AC-2 | Given I click a color, when selected, then visual indication shows selection | Must Have | Yes |
| AC-3 | Given I select a color, when confirmed, then color value saves to form state | Must Have | Yes |
| AC-4 | Given color picker is open, when I use keyboard, then I can arrow between colors | Must Have | Yes |
| AC-5 | Given color picker is open, when I press Enter, then color is selected | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Accessibility:** WCAG 2.1 AA compliant (focus, keyboard, screen reader)
- **Performance:** Color picker renders in < 50ms
- **Usability:** Clear visual feedback for selection

## 3. Technical Specifications

### 3.1 Color Palette
**apps/web/src/shared/components/ui/ColorPicker/colorPalette.ts:**
```typescript
export interface ColorOption {
  value: string;
  label: string;
  contrastText: string;
}

export const colorPalette: ColorOption[] = [
  { value: '#EF5350', label: 'Red', contrastText: '#FFFFFF' },
  { value: '#EC407A', label: 'Pink', contrastText: '#FFFFFF' },
  { value: '#AB47BC', label: 'Purple', contrastText: '#FFFFFF' },
  { value: '#7E57C2', label: 'Deep Purple', contrastText: '#FFFFFF' },
  { value: '#42A5F5', label: 'Blue', contrastText: '#FFFFFF' },
  { value: '#29B6F6', label: 'Light Blue', contrastText: '#000000' },
  { value: '#26C6DA', label: 'Cyan', contrastText: '#000000' },
  { value: '#26A69A', label: 'Teal', contrastText: '#FFFFFF' },
  { value: '#66BB6A', label: 'Green', contrastText: '#FFFFFF' },
  { value: '#9CCC65', label: 'Light Green', contrastText: '#000000' },
  { value: '#FFA726', label: 'Orange', contrastText: '#FFFFFF' },
  { value: '#FFA726', label: 'Amber', contrastText: '#000000' },
];

// Default color for new projects
export const DEFAULT_PROJECT_COLOR = colorPalette[0].value;
```

### 3.2 Color Picker Component
**apps/web/src/shared/components/ui/ColorPicker/ColorPicker.tsx:**
```typescript
import React, { useState, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { colorPalette, ColorOption } from './colorPalette';

const ColorButton = styled(IconButton)<{ selected: boolean; colorValue: string }>(({
  selected,
  colorValue,
  theme,
}) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: colorValue,
  border: selected ? '3px solid' : '2px solid transparent',
  borderColor: selected ? 'primary.main' : 'transparent',
  padding: 0,
  transition: theme.transitions.create(['transform', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: colorValue,
    transform: 'scale(1.1)',
  },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
  },
}));

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const handleColorSelect = (color: ColorOption) => {
    if (!disabled) {
      onChange(color.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const cols = 6; // Number of columns in grid

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, colorPalette.length - 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + cols, colorPalette.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - cols, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleColorSelect(colorPalette[index]);
        break;
      default:
        break;
    }
  };

  return (
    <Box
      role="group"
      aria-label="Project color selection"
      data-testid="color-picker"
    >
      <Grid container spacing={1.5}>
        {colorPalette.map((color, index) => {
          const isSelected = value === color.value;
          const isFocused = focusedIndex === index;

          return (
            <Grid item key={color.value}>
              <Tooltip title={color.label} arrow>
                <ColorButton
                  selected={isSelected}
                  colorValue={color.value}
                  onClick={() => handleColorSelect(color)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={disabled}
                  tabIndex={isFocused ? 0 : -1}
                  aria-label={`Select ${color.label} color`}
                  aria-pressed={isSelected}
                  data-testid={`color-option-${color.value.replace('#', '')}`}
                />
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
      {value && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '4px',
              backgroundColor: value,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Selected: {value}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;
```

### 3.3 Color Picker in Form Context
**Example Usage in Project Form:**
```typescript
import React, { useState } from 'react';
import { ColorPicker } from '../shared/components/ui/ColorPicker/ColorPicker';
import { DEFAULT_PROJECT_COLOR } from '../shared/components/ui/ColorPicker/colorPalette';

function CreateProjectForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: DEFAULT_PROJECT_COLOR,
  });

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  return (
    <form>
      {/* Other form fields */}
      <ColorPicker
        value={formData.color}
        onChange={handleColorChange}
        aria-label="Select project color"
      />
    </form>
  );
}
```

### 3.4 Color Utility Functions
**apps/web/src/shared/components/ui/ColorPicker/colorUtils.ts:**
```typescript
/**
 * Get contrast text color for a given background color
 * Uses WCAG 2.1 luminance formula
 */
export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Validate hex color format
 */
export const isValidHexColor = (hex: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
};

/**
 * Generate random color from palette
 */
export const getRandomColor = (): string => {
  const { colorPalette } = require('./colorPalette');
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex].value;
};
```

## 4. Setup Instructions

### 4.1 File Structure
```
apps/web/src/shared/components/ui/ColorPicker/
├── ColorPicker.tsx       # Main color picker component
├── ColorPicker.spec.tsx  # Component tests
├── colorPalette.ts       # Color definitions
├── colorUtils.ts         # Color utility functions
└── index.ts              # Barrel export
```

### 4.2 Integration Example
```typescript
// Add to apps/web/src/shared/components/ui/index.ts
export { ColorPicker } from './ColorPicker/ColorPicker';
export { colorPalette, DEFAULT_PROJECT_COLOR } from './ColorPicker/colorPalette';
export { getContrastColor, isValidHexColor } from './ColorPicker/colorUtils';
```

## 5. Validation Checklist

### 5.1 Component Validation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Colors display | Render component | 12 color buttons visible |
| Color selection | Click color | Selected state shows (border) |
| Tooltip | Hover color | Color name appears |
| Keyboard navigation | Arrow keys | Focus moves between colors |
| Enter key | Focus color, press Enter | Color selected |
| Selected display | After selection | Color preview and hex shown |

### 5.2 Accessibility Validation
| Check | Test | Expected Result |
|-------|------|-----------------|
| Focus visible | Tab to color picker | Focus ring on focused color |
| Arrow navigation | Use arrow keys | Focus moves logically |
| Screen reader | Use NVDA/VoiceOver | Color names announced |
| Keyboard selection | Enter/Space on color | Color selected |

### 5.3 Component Test Example
```typescript
// apps/web/src/shared/components/ui/ColorPicker/ColorPicker.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPicker } from './ColorPicker';
import { colorPalette } from './colorPalette';

describe('ColorPicker', () => {
  it('renders all colors', () => {
    render(<ColorPicker value="#EF5350" onChange={jest.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(colorPalette.length);
  });

  it('selects color on click', () => {
    const handleChange = jest.fn();
    render(<ColorPicker value="#EF5350" onChange={handleChange} />);
    
    const firstColor = screen.getByLabelText(`Select ${colorPalette[0].label} color`);
    fireEvent.click(firstColor);
    
    expect(handleChange).toHaveBeenCalledWith(colorPalette[0].value);
  });

  it('shows selected state', () => {
    render(<ColorPicker value="#EF5350" onChange={jest.fn()} />);
    
    const selectedColor = screen.getByLabelText('Select Red color');
    expect(selectedColor).toHaveAttribute('aria-pressed', 'true');
  });

  it('navigates with arrow keys', () => {
    render(<ColorPicker value="#EF5350" onChange={jest.fn()} />);
    
    const firstColor = screen.getByLabelText(`Select ${colorPalette[0].label} color`);
    firstColor.focus();
    
    fireEvent.keyDown(firstColor, { key: 'ArrowRight' });
    const secondColor = screen.getByLabelText(`Select ${colorPalette[1].label} color`);
    expect(secondColor).toHaveFocus();
  });

  it('selects color with Enter key', () => {
    const handleChange = jest.fn();
    render(<ColorPicker value="#EF5350" onChange={handleChange} />);
    
    const firstColor = screen.getByLabelText(`Select ${colorPalette[0].label} color`);
    fireEvent.keyDown(firstColor, { key: 'Enter' });
    
    expect(handleChange).toHaveBeenCalledWith(colorPalette[0].value);
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Story 5a.1: Material UI Theme (theme configured)
- Story 5a.3: Core UI Components (IconButton, Tooltip patterns)

### 6.2 External Dependencies
- @mui/material@5.x
- @mui/icons-material@5.x

## 7. Technical Considerations

### 7.1 Color Selection
- Predefined palette ensures visual consistency
- WCAG contrast ratios considered for each color
- Default color provided for new projects

### 7.2 Keyboard Accessibility
- Arrow key navigation (up, down, left, right)
- Enter/Space to select
- Focus management for screen readers
- Visible focus indicators

### 7.3 Responsive Design
- Grid layout adapts to container width
- Color buttons scale appropriately
- Touch-friendly size (40x40px minimum)

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Build and verify
npx nx build web

# Run tests
npx nx test web --testPathPattern="ColorPicker"
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Colors not displaying | Check colorPalette array |
| Keyboard navigation broken | Verify onKeyDown handler |
| Selected state not showing | Check value prop matching |
| Tooltips not appearing | Ensure Tooltip wraps IconButton |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/web/src/shared/components/ui/ColorPicker/ColorPicker.tsx` | CREATE | Color picker component | ~100 |
| `apps/web/src/shared/components/ui/ColorPicker/colorPalette.ts` | CREATE | Color definitions | ~20 |
| `apps/web/src/shared/components/ui/ColorPicker/colorUtils.ts` | CREATE | Color utilities | ~30 |
| `apps/web/src/shared/components/ui/ColorPicker/ColorPicker.spec.tsx` | CREATE | Component tests | ~60 |
| `apps/web/src/shared/components/ui/ColorPicker/index.ts` | CREATE | Barrel export | ~5 |
| `apps/web/src/shared/components/ui/index.ts` | MODIFY | Export ColorPicker | ~5 |

### Implementation Notes
- 12 colors in palette (good balance of choice vs overwhelm)
- 40x40px buttons (WCAG touch target size)
- Grid layout with 6 columns
- Arrow key navigation follows grid pattern

### Code Review Checklist
- [ ] All 12 colors display correctly
- [ ] Selection state visible
- [ ] Keyboard navigation works
- [ ] Tooltips show color names
- [ ] Focus indicators visible
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
- [Story 5a.3: Core UI Components](./5a-3-core-ui-components.md)
- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
