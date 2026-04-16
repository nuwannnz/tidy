import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' },
});

const dynamoDb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'tidy-local';

async function createTable(): Promise<void> {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table ${TABLE_NAME} already exists.`);
  } catch {
    console.log(`Creating ${TABLE_NAME} table...`);
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
          { AttributeName: 'GSI1PK', AttributeType: 'S' },
          { AttributeName: 'GSI1SK', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'GSI1',
            KeySchema: [
              { AttributeName: 'GSI1PK', KeyType: 'HASH' },
              { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );
    console.log(`Table ${TABLE_NAME} created.`);
  }
}

async function seedUsers(): Promise<void> {
  const passwordHash = await bcrypt.hash('SecurePass123!', 12);

  await dynamoDb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: 'USER#test-user-id',
        SK: 'PROFILE',
        GSI1PK: 'EMAIL#test@example.com',
        GSI1SK: 'PROFILE',
        entityType: 'USER',
        email: 'test@example.com',
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  );

  console.log('Test user created: test@example.com / SecurePass123!');
}

async function seed(): Promise<void> {
  console.log('Seeding local DynamoDB...');
  await createTable();
  await seedUsers();
  console.log('Seed complete!');
}

seed().catch(console.error);
