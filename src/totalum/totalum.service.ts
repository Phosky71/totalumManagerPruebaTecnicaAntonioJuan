import * as totalum from 'totalum-api-sdk';

const options = {
  apiKey: {
    'api-key': 'sk-eyJrZXkiOiJmNjk4ZmVlN2NmNTJjMGNjMWE5Y2UwMDQiLCJuYW1lIjoiRGVmYXVsdCBBUEkgS2V5IGF1dG9nZW5lcmF0ZWQgOGJodSIsIm9yZ2FuaXphdGlvbklkIjoiYW50b25pb2p1YW4tcHJ1ZWJhLXRlY25pY2EifQ__'
  }
};

export const totalumSdk = new totalum.TotalumApiSdk(options);
