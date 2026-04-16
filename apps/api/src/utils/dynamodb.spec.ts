describe('DynamoDB Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should export dynamoDb client', async () => {
    const { dynamoDb } = await import('./dynamodb');
    expect(dynamoDb).toBeDefined();
  });

  it('should export TABLE_NAME defaulting to "tidy"', async () => {
    delete process.env['DYNAMODB_TABLE_NAME'];
    const { TABLE_NAME } = await import('./dynamodb');
    expect(TABLE_NAME).toBe('tidy');
  });

  it('should use DYNAMODB_TABLE_NAME env var when set', async () => {
    process.env['DYNAMODB_TABLE_NAME'] = 'tidy-local';
    const { TABLE_NAME } = await import('./dynamodb');
    expect(TABLE_NAME).toBe('tidy-local');
  });
});
