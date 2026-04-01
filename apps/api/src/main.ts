import { app } from './app';

// Lambda handler
export const handler = async (event: any, context: any) => {
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

console.log('API module loaded');
