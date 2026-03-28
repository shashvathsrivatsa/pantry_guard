require("dotenv").config({ silent: true });

const http = require("http");
const fs = require("fs");
const path = require("path");
const { inputReceipt } = require("./server/ocr");
const { fetchRecallsWithSummaries } = require("./server/fda_tracker");

const port = 3000;

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg"
};

// Ensure receipts/ dir exists
if (!fs.existsSync("receipts")) fs.mkdirSync("receipts");

const server = http.createServer((req, res) => {

    // ── GET /recalls — fetch ongoing food recalls from FDA API ──
    if (req.method === "GET" && req.url === "/recalls") {
        (async () => {
            try {
                const recalls = await fetchRecallsWithSummaries({
                    limit: 100,
                    summarizeTopN: 20
                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true, data: recalls }));
            } catch (err) {
                console.error("Recalls fetch error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: err.message }));
            }
        })();
        return;
    }

    // ── POST /scan — receive base64 photo, save, run OCR pipeline ──
    if (req.method === "POST" && req.url === "/scan") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const { image } = JSON.parse(body); // base64 data URL
                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                const filename = `receipts/${Date.now()}.jpg`;
                fs.writeFileSync(filename, Buffer.from(base64Data, "base64"));

                const result = await inputReceipt(filename);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: true, data: result }));
            } catch (err) {
                console.error("Scan error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: err.message }));
            }
        });
        return;
    }

    // ── Static file serving ──
    let filePath = "." + (req.url === "/" ? "/index.html" : req.url);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("Not Found");
        } else {
            res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
            res.end(content);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
