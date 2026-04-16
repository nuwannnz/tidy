import { app } from './app';
import { env } from './utils/env';

// Lambda handler
export const handler = async (event: unknown, _context: unknown) => {
  console.log('Lambda function invoked', event);

  // Here you would use serverless-http or similar to handle Express in Lambda
  // For now, return a simple response
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Tidy API is running on AWS Lambda',
      timestamp: new Date().toISOString(),
    }),
  };
};

// Local development server (Docker or direct)
if (env.NODE_ENV === 'local' || env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  app.listen(env.PORT, () => {
    console.log(`API running locally on port ${env.PORT}`);
    if (env.DYNAMODB_ENDPOINT) {
      console.log(`DynamoDB endpoint: ${env.DYNAMODB_ENDPOINT}`);
    }
  });
}
