import { HttpInterceptorFn } from '@angular/common/http';

export const devAuthInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next(cloned)
    }
  return next(req);
};
