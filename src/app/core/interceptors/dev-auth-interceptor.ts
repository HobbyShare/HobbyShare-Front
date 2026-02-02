import { HttpInterceptorFn } from '@angular/common/http';

const DEV_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im1hY2EiLCJzdWIiOiI2OTdlMWU5ZDM3MDE1ZjZjNDlkZDJjNTAiLCJpYXQiOjE3Njk4ODgxNTQsImV4cCI6MTc2OTg5MTc1NH0.lCaRgDhCW998nP_b7jmMdIxdK5sqg4zNw5hhitJ7Lxw';

export const devAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo para entorno de desarrollo
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${DEV_TOKEN}`,
    },
  });

  return next(authReq);
};
