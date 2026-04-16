import { app } from './app';
import * as http from 'http';

describe('API App', () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = app.listen(0, () => {
      const address = server.address();
      port = typeof address === 'object' && address ? address.port : 0;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should respond to GET /health', (done) => {
    http.get(`http://localhost:${port}/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const parsed = JSON.parse(body);
        expect(parsed.message).toBe('Health check successful');
        done();
      });
    });
  });

  it('should respond to GET /api/v1/health with healthy status', (done) => {
    http.get(`http://localhost:${port}/api/v1/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const parsed = JSON.parse(body);
        expect(parsed.status).toBe('healthy');
        expect(parsed.timestamp).toBeDefined();
        expect(parsed.environment).toBeDefined();
        done();
      });
    });
  });

  it('should respond to GET /', (done) => {
    http.get(`http://localhost:${port}/`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        const parsed = JSON.parse(body);
        expect(parsed.data).toBe('Welcome to Tidy API');
        done();
      });
    });
  });

  it('should sanitize query parameters with angle brackets', (done) => {
    http.get(`http://localhost:${port}/health?name=%3Cscript%3E`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});
