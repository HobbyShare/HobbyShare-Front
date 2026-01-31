import { HttpInterceptorFn } from '@angular/common/http';

const DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Impvc2UiLCJzdWIiOiI2OTdiMzZmNTUxNjU5NDBhZTFlZTNhOGIiLCJpYXQiOjE3Njk4ODU3NjksImV4cCI6MTc2OTg4OTM2OX0.EmJZ-BwRp3QC6jo2ymDhFn1M4MR_lv-FWn_ow8oTk_8';

export const devAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo para entorno de desarrollo
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  return next(authReq);
};
