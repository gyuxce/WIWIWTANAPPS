import http from "node:http";

const listenPort = Number(process.env.QA_PROXY_PORT || 8888);
const upstreamHost = process.env.QA_PROXY_UPSTREAM_HOST || "127.0.0.1";
const upstreamPort = Number(process.env.QA_PROXY_UPSTREAM_PORT || 8000);
const mode = process.env.QA_PROXY_MODE || "passthrough";
const delayMs = Number(process.env.QA_PROXY_DELAY_MS || 2500);

const apiPrefix = "/api/v1/";

const isApiRequest = pathname => pathname.startsWith(apiPrefix);

const nullCovers = value => {
  if (Array.isArray(value)) {
    return value.map(nullCovers);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === "cover" ? null : nullCovers(item),
    ]),
  );
};

const createMalformedPayload = (pathname, payload) => {
  const data = Array.isArray(payload?.data) ? payload.data : [];

  if (pathname.endsWith("/module/progress")) {
    return {
      ...payload,
      data: data.map(item => ({
        ...item,
        materi_count: null,
        materi_count_progress: null,
        virtual_count: null,
        virtual_count_progress: null,
        assesment_count: null,
        assesment_count_progress: null,
        cover: null,
      })),
    };
  }

  if (pathname.endsWith("/module/materi/virtual-class")) {
    return {
      ...payload,
      data: data.map(item => ({ ...item, classVirtual: null })),
    };
  }

  if (pathname.endsWith("/module/materi/assesment")) {
    return {
      ...payload,
      data: data.map(item => ({ ...item, assesment: null })),
    };
  }

  if (pathname.endsWith("/module/materi/content")) {
    return { ...payload, data: nullCovers(payload?.data) };
  }

  return payload;
};

const shouldMutateNullPayload = pathname =>
  pathname.endsWith("/module/progress") ||
  pathname.endsWith("/module/materi/virtual-class") ||
  pathname.endsWith("/module/materi/assesment") ||
  pathname.endsWith("/module/materi/content");

const responseHeaders = (headers, body) => {
  const output = { ...headers };
  delete output.connection;
  delete output["keep-alive"];
  delete output["proxy-connection"];
  delete output["transfer-encoding"];
  delete output["content-length"];
  output["content-length"] = Buffer.byteLength(body);
  return output;
};

const server = http.createServer((request, response) => {
  let targetUrl;

  try {
    const rawTarget = request.url?.startsWith("http")
      ? request.url
      : `http://${request.headers.host}${request.url}`;
    targetUrl = new URL(rawTarget);
  } catch {
    response.writeHead(400, { "content-type": "text/plain" });
    response.end("Invalid proxy target");
    return;
  }

  const path = targetUrl.pathname;
  const targetPath = `${path}${targetUrl.search}`;
  const targetRequest = http.request(
    {
      hostname: upstreamHost,
      port: upstreamPort,
      method: request.method,
      path: targetPath,
      headers: {
        ...request.headers,
        host: `${upstreamHost}:${upstreamPort}`,
        connection: "close",
      },
    },
    upstreamResponse => {
      const chunks = [];

      upstreamResponse.on("data", chunk => chunks.push(chunk));
      upstreamResponse.on("end", () => {
        let body = Buffer.concat(chunks).toString("utf8");
        let fixture = "passthrough";

        if (
          mode === "null" &&
          request.method === "GET" &&
          isApiRequest(path) &&
          shouldMutateNullPayload(path)
        ) {
          try {
            body = JSON.stringify(
              createMalformedPayload(path, JSON.parse(body)),
            );
            fixture = "null-incomplete";
          } catch {
            fixture = "null-incomplete-parse-failed";
          }
        }

        const finish = () => {
          response.writeHead(
            upstreamResponse.statusCode || 502,
            responseHeaders(upstreamResponse.headers, body),
          );
          response.end(body);
          console.log(
            `${request.method} ${path} -> ${upstreamResponse.statusCode} fixture=${fixture}`,
          );
        };

        if (mode === "delay" && isApiRequest(path)) {
          setTimeout(finish, delayMs);
        } else {
          finish();
        }
      });
    },
  );

  targetRequest.on("error", error => {
    response.writeHead(502, { "content-type": "application/json" });
    response.end(JSON.stringify({ message: "QA proxy upstream error" }));
    console.error(`upstream error: ${error.message}`);
  });

  request.pipe(targetRequest);
});

server.listen(listenPort, "0.0.0.0", () => {
  console.log(
    `QA proxy ready on 0.0.0.0:${listenPort}; mode=${mode}; upstream=${upstreamHost}:${upstreamPort}; delayMs=${delayMs}`,
  );
});

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
