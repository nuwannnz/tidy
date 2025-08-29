import { getCurrentWeekRange } from './weeks';
import { expect, describe, test, beforeAll, afterAll, vi } from 'vitest';

describe('getCurrentWeekRange', () => {
  function setDateTo(dateStr: string) {
    const date = new Date(dateStr);
    vi.setSystemTime(date);
  }

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test('returns correct range when Monday and Sunday are in the same month', () => {
    setDateTo('2025-08-06'); // Wednesday, week is Aug 4 (Mon) - Aug 10 (Sun)
    expect(getCurrentWeekRange()).toBe('4th Mon - 10th Sun Aug');
  });

  test('returns correct range when Monday and Sunday are in different months', () => {
    setDateTo('2025-07-31'); // Thursday, week is Jul 28 (Mon) - Aug 03 (Sun)
    expect(getCurrentWeekRange()).toBe('28th Mon Jul - 3rd Sun Aug');
  });

  test('uses correct suffix for 1st, 2nd, 3rd, 11th, 12th, 13th', () => {
    setDateTo('2025-09-01'); // Monday, week is Sep 1 (Mon) - Sep 7 (Sun)
    expect(getCurrentWeekRange()).toBe('1st Mon - 7th Sun Sep');

    setDateTo('2025-09-02'); // Tuesday, week is Sep 1 (Mon) - Sep 7 (Sun)
    expect(getCurrentWeekRange()).toBe('1st Mon - 7th Sun Sep');

    setDateTo('2025-09-03'); // Wednesday, week is Sep 1 (Mon) - Sep 7 (Sun)
    expect(getCurrentWeekRange()).toBe('1st Mon - 7th Sun Sep');

    setDateTo('2025-09-11'); // Thursday, week is Sep 8 (Mon) - Sep 14 (Sun)
    expect(getCurrentWeekRange()).toBe('8th Mon - 14th Sun Sep');
  });
});
