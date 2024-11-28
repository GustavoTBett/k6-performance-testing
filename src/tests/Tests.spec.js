import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const getFuncionalidadesDuration = new Trend(
  'get_funcionalidades',
  true
);
export const RateContentOK = new Rate('content_OK');

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.12'],
    get_funcionalidades: ['p(95)<5700']
  },
  stages: [
    { duration: '10s', target: 0 },
    { duration: '20s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '30s', target: 30 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 140 },
    { duration: '30s', target: 140 },
    { duration: '50s', target: 260 }
  ]
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  // const baseUrl = 'https://api.useawise.com/companies';
  const baseUrl = 'https://controlle.com/funcionalidades';

  const params = {
    headers: {
      'Content-Type': 'text/html'
      // Authorization: `Bearer ${token}`
    }
  };

  const OK = 200;

  const res = http.get(`${baseUrl}`, params);

  getFuncionalidadesDuration.add(res.timings.duration);

  RateContentOK.add(res.status === OK);

  check(res, {
    'GET Funcionalidades - Status 200': () => res.status === OK
  });
}
