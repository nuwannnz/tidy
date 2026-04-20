import { UserRepository } from './user.repository';
import { dynamoDb, TABLE_NAME } from '../utils/dynamodb';

jest.mock('../utils/dynamodb', () => ({
  dynamoDb: { send: jest.fn() },
  TABLE_NAME: 'tidy-test',
}));

const mockSend = jest.mocked(dynamoDb.send);

describe('UserRepository', () => {
  let repo: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new UserRepository();
  });

  describe('create', () => {
    it('creates a user record with normalized email', async () => {
      mockSend.mockResolvedValue({} as never);

      const record = await repo.create('User@Example.COM', 'hash123');

      expect(record.email).toBe('user@example.com');
      expect(record.GSI1PK).toBe('EMAIL#user@example.com');
      expect(record.passwordHash).toBe('hash123');
      expect(record.entityType).toBe('USER');
      expect(record.id).toBeDefined();
      expect(record.PK).toBe(`USER#${record.id}`);
    });

    it('sends PutCommand with ConditionExpression to prevent duplicates', async () => {
      mockSend.mockResolvedValue({} as never);

      await repo.create('test@example.com', 'hash');

      const [command] = mockSend.mock.calls[0] as unknown as [{ input: Record<string, unknown> }][];
      expect(command.input).toMatchObject({
        TableName: TABLE_NAME,
        ConditionExpression: 'attribute_not_exists(GSI1PK)',
      });
    });
  });

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      const fakeItem = {
        PK: 'USER#abc',
        SK: 'PROFILE',
        GSI1PK: 'EMAIL#test@example.com',
        GSI1SK: 'PROFILE',
        entityType: 'USER',
        id: 'abc',
        email: 'test@example.com',
        passwordHash: 'hash',
        createdAt: '2026-04-17T00:00:00.000Z',
        updatedAt: '2026-04-17T00:00:00.000Z',
      };
      mockSend.mockResolvedValue({ Items: [fakeItem] } as never);

      const result = await repo.findByEmail('test@example.com');

      expect(result).toEqual(fakeItem);
    });

    it('returns null when not found', async () => {
      mockSend.mockResolvedValue({ Items: [] } as never);

      const result = await repo.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });

    it('normalizes email to lowercase before querying', async () => {
      mockSend.mockResolvedValue({ Items: [] } as never);

      await repo.findByEmail('UPPER@EXAMPLE.COM');

      const [command] = mockSend.mock.calls[0] as unknown as [{ input: Record<string, unknown> }][];
      expect(command.input).toMatchObject({
        ExpressionAttributeValues: {
          ':pk': 'EMAIL#upper@example.com',
          ':sk': 'PROFILE',
        },
      });
    });
  });
});
