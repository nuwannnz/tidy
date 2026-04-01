import { app } from './app';

describe('API App', () => {
  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should have express app configured', () => {
    expect(app.get('env')).toBe('test');
  });
});
