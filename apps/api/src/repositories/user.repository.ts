import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { dynamoDb, TABLE_NAME } from '../utils/dynamodb';

export interface UserRecord {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: string;
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export class UserRepository {
  async create(email: string, passwordHash: string): Promise<UserRecord> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const normalizedEmail = email.toLowerCase();

    const item: UserRecord = {
      PK: `USER#${id}`,
      SK: 'PROFILE',
      GSI1PK: `EMAIL#${normalizedEmail}`,
      GSI1SK: 'PROFILE',
      entityType: 'USER',
      id,
      email: normalizedEmail,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: 'attribute_not_exists(GSI1PK)',
      })
    );

    return item;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalizedEmail = email.toLowerCase();

    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
        ExpressionAttributeValues: {
          ':pk': `EMAIL#${normalizedEmail}`,
          ':sk': 'PROFILE',
        },
      })
    );

    const items = result.Items as UserRecord[] | undefined;
    return items && items.length > 0 ? items[0] : null;
  }
}
