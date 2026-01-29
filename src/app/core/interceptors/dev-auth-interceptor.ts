import { HttpInterceptorFn } from '@angular/common/http';

const DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Impvc2UiLCJzdWIiOiI2OTdiMzZmNTUxNjU5NDBhZTFlZTNhOGIiLCJpYXQiOjE3Njk3MTQxNDMsImV4cCI6MTc2OTcxNzc0M30.vqLaLKgXT7nlsgIZI2zNHLHqBW694zGDF6sZDHKyy5A';

export const devAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo para entorno de desarrollo
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  return next(authReq);
};
