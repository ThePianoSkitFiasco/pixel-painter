const http = require("http");
const fs = require("fs");
const path = require("path");

const { createCanvas } = require("./canvas-state");
const { applyTool } = require("./tools");

const PORT = process.env.PORT || 3000;
const canvas = createCanvas(64, 64);

function getCanvasData() {
  return JSON.parse(canvas.serializeCanvas());
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(data));
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    const extension = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
    };

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "text/plain; charset=utf-8",
    });
    response.end(content);
  });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const url = request.url || "/";

  if (request.method === "GET" && url === "/canvas") {
    sendJson(response, 200, getCanvasData());
    return;
  }

  if (request.method === "POST" && url === "/apply-tool") {
    try {
      const action = await readJsonBody(request);
      const result = applyTool(canvas, action);

      sendJson(response, 200, {
        result,
        canvas: getCanvasData(),
      });
    } catch (error) {
      sendJson(response, 400, {
        result: { ok: false, error: "Invalid JSON" },
        canvas: getCanvasData(),
      });
    }

    return;
  }

  if (request.method === "POST" && url === "/clear") {
    canvas.clearCanvas();
    sendJson(response, 200, getCanvasData());
    return;
  }

  if (request.method === "GET" && url === "/") {
    sendFile(response, path.join(__dirname, "index.html"));
    return;
  }

  if (request.method === "GET" && url === "/styles.css") {
    sendFile(response, path.join(__dirname, "styles.css"));
    return;
  }

  if (request.method === "GET" && url === "/app.js") {
    sendFile(response, path.join(__dirname, "app.js"));
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
