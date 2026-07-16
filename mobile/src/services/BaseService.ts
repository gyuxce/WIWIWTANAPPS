/* eslint-disable @typescript-eslint/no-shadow */
import { dedupe, throttlingCache } from "utils/middlewares";
import wretch from "wretch";
import { API_URL } from '@env';

const BaseService = (url: string, token?: string) => {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  if (token !== "") {
    headers.append("Authorization", "Bearer " + token);
  }
  return wretch(API_URL + url)
    .errorType("json")
    .headers(headers)
    .middlewares([
      dedupe({
        /* Options - defaults below */
        skip: (_, opts) => opts.skipDedupe || opts.method !== "GET",
        key: (url, opts) => opts.method + "@" + url,
        resolver: response => response.clone(),
      }),
      throttlingCache({
        /* Options - defaults below */
        throttle: 1000,
        skip: (_, opts) => opts.skipCache || opts.method !== "GET",
        key: (url, opts) => opts.method + "@" + url,
        clear: () => false,
        invalidate: () => "",
        condition: response => response.ok,
        flagResponseOnCacheHit: "__cached",
      }),
      (next: any) => async (url: any, opts: any) => {
        const response = await next(url, opts);
        try {
          Reflect.get(response, "type", response);
        } catch (error) {
          Object.defineProperty(response, "type", {
            get: () => "default",
          });
        }
        return response;
      },
    ])
    .resolve(r =>
      r
        .error(502, () => {
          return 502;
        })
        .error(201, () => {
          return 201;
        })
        .notFound(() => {
          return 404;
        })
        .fetchError(() => {
          return 400;
        })
        .forbidden(() => {
          return 403;
        })
        .unauthorized(() => {
          return 401;
        })
        .badRequest(() => {
          return 400;
        })
        .internalError(e => {
          return 500;
        })
        .json(),
    );
};

export default BaseService;
