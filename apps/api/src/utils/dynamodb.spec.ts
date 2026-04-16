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

  it('should configure local endpoint when NODE_ENV is local', async () => {
    process.env['NODE_ENV'] = 'local';
    process.env['DYNAMODB_ENDPOINT'] = 'http://localhost:8000';
    process.env['AWS_ACCESS_KEY_ID'] = 'mock-key';
    process.env['AWS_SECRET_ACCESS_KEY'] = 'mock-secret';
    const { dynamoDb } = await import('./dynamodb');
    expect(dynamoDb).toBeDefined();
  });

  it('should use default credentials when not provided in local mode', async () => {
    process.env['NODE_ENV'] = 'local';
    delete process.env['AWS_ACCESS_KEY_ID'];
    delete process.env['AWS_SECRET_ACCESS_KEY'];
    const { dynamoDb } = await import('./dynamodb');
    expect(dynamoDb).toBeDefined();
  });
});
