import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from './env';

const isLocal = env.NODE_ENV === 'local';

const client = new DynamoDBClient({
  region: env.AWS_REGION,
  ...(isLocal && {
    endpoint: env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID || 'mock',
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY || 'mock',
    },
  }),
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = env.DYNAMODB_TABLE_NAME;
