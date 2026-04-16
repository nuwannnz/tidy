describe('loadEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return defaults when env vars are not set', async () => {
    delete process.env['NODE_ENV'];
    delete process.env['PORT'];
    delete process.env['AWS_REGION'];
    delete process.env['DYNAMODB_TABLE_NAME'];

    const { loadEnv } = await import('./env');
    const env = loadEnv();

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
    expect(env.AWS_REGION).toBe('us-east-1');
    expect(env.DYNAMODB_TABLE_NAME).toBe('tidy');
  });

  it('should use env var values when set', async () => {
    process.env['NODE_ENV'] = 'local';
    process.env['PORT'] = '4000';
    process.env['DYNAMODB_TABLE_NAME'] = 'tidy-local';
    process.env['DYNAMODB_ENDPOINT'] = 'http://localhost:8000';

    const { loadEnv } = await import('./env');
    const env = loadEnv();

    expect(env.NODE_ENV).toBe('local');
    expect(env.PORT).toBe(4000);
    expect(env.DYNAMODB_TABLE_NAME).toBe('tidy-local');
    expect(env.DYNAMODB_ENDPOINT).toBe('http://localhost:8000');
  });

  it('should return undefined for optional vars when not set', async () => {
    delete process.env['DYNAMODB_ENDPOINT'];
    delete process.env['AWS_LAMBDA_FUNCTION_NAME'];

    const { loadEnv } = await import('./env');
    const env = loadEnv();

    expect(env.DYNAMODB_ENDPOINT).toBeUndefined();
    expect(env.AWS_LAMBDA_FUNCTION_NAME).toBeUndefined();
  });

  it('should fall back to default when PORT is not a number', async () => {
    process.env['PORT'] = 'invalid';

    const { loadEnv } = await import('./env');
    const env = loadEnv();

    expect(env.PORT).toBe(3001);
  });
});
