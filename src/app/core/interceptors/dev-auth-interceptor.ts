import { HttpInterceptorFn } from '@angular/common/http';

const DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Impvc2UiLCJzdWIiOiI2OTdiMzZmNTUxNjU5NDBhZTFlZTNhOGIiLCJpYXQiOjE3Njk3ODU4NzgsImV4cCI6MTc2OTc4OTQ3OH0.hSuQZ9ND9cIrfg6_SOrkxC-c_HMZwIM50Z2pQuaOFT8';

export const devAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo para entorno de desarrollo
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  return next(authReq);
};
