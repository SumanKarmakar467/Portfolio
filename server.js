const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5500);
const rootDir = process.cwd();

const mimeTypes = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=UTF-8"
};

const server = http.createServer((req, res) => {
  const safeUrlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const requestedPath = safeUrlPath === "/" ? "index.html" : safeUrlPath.replace(/^[/\\]+/, "");
  const normalizedPath = path.normalize(requestedPath);
  const absolutePath = path.resolve(rootDir, normalizedPath);

  const insideProject =
    absolutePath === rootDir || absolutePath.startsWith(`${rootDir}${path.sep}`);

  if (!insideProject) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=UTF-8" });
    res.end("403 Forbidden");
    return;
  }

  fs.stat(absolutePath, (statError, stats) => {
    if (statError || !stats) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
      res.end("404 Not Found");
      return;
    }

    const filePath = stats.isDirectory() ? path.join(absolutePath, "index.html") : absolutePath;

    fs.readFile(filePath, (readError, data) => {
      if (readError) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
        res.end("404 Not Found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Portfolio server running at http://${host}:${port}`);
});
