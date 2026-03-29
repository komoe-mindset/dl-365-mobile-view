import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import Papa from "papaparse";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API endpoint to fetch meditations from Google Sheets
  app.get("/api/meditations", async (req, res) => {
    try {
      const SHEET_ID = "14y9p-Z35NCNWlgOiiBY39epO9M44cESG7mlVwEJcAYM";
      const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
      
      const response = await axios.get(CSV_URL);
      const csvData = response.data;
      
      const parsed = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });
      
      // Map the data to a cleaner format
      const meditations = parsed.data.map((row: any) => {
        // Find the share link column regardless of exact casing/spacing
        const shareLinkKey = Object.keys(row).find(k => k.toLowerCase().includes("share link")) || "Share Link";
        const shareLink = row[shareLinkKey] || "";
        let audioUrl = "";
        let driveId = "";
        
        // Convert Google Drive share link to direct download link
        const driveIdMatch = shareLink.match(/[?&]id=([^&]+)/) || shareLink.match(/\/d\/([^/]+)/);
        if (driveIdMatch) {
          driveId = driveIdMatch[1].split('/')[0];
          // Use our internal proxy route for more reliable streaming
          audioUrl = `/api/audio-proxy?id=${driveId}`;
        }

        return {
          no: row["No."] || row["no"] || "",
          dayCount: row["Day Count"] || row["day count"] || "",
          date: row["Date (DD-MM-YYYY)"] || row["date"] || "",
          fileName: row["File Name (Myanmar Text)"] || row["file name"] || "",
          shareLink: shareLink,
          audioUrl: audioUrl,
          driveId: driveId
        };
      });

      res.json(meditations);
    } catch (error) {
      console.error("Error fetching meditations:", error);
      res.status(500).json({ error: "Failed to fetch meditations" });
    }
  });

  // Proxy route for Google Drive audio
  app.get("/api/audio-proxy", async (req, res) => {
    const fileId = req.query.id as string;
    if (!fileId) return res.status(400).send("Missing file ID");

    try {
      // Use drive.google.com instead of docs.google.com
      const driveUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
      
      const forwardHeaders: any = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };
      
      // Forward Range header from browser to Google Drive
      if (req.headers.range) {
        forwardHeaders.range = req.headers.range;
      }

      let response = await axios({
        method: 'get',
        url: driveUrl,
        responseType: 'stream',
        headers: forwardHeaders,
        validateStatus: () => true, // Don't throw on 302 or 403
      });

      // Handle virus scan confirmation for large files
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        let html = '';
        const chunks: any[] = [];
        for await (const chunk of response.data) {
          chunks.push(chunk);
        }
        html = Buffer.concat(chunks).toString();

        const confirmMatch = html.match(/confirm=([a-zA-Z0-9_]+)/);
        if (confirmMatch) {
          const confirmCode = confirmMatch[1];
          const confirmUrl = `${driveUrl}&confirm=${confirmCode}`;
          
          response = await axios({
            method: 'get',
            url: confirmUrl,
            responseType: 'stream',
            headers: forwardHeaders,
            validateStatus: () => true,
          });
        } else {
          console.error(`Could not find confirmation code in HTML for file ${fileId}`);
          // If we can't find the code, maybe it's a real error page
          return res.status(response.status).send("Google Drive restricted access or file not found.");
        }
      }

      // Forward status and essential headers back to the browser
      res.status(response.status);
      
      const responseHeaders = response.headers;
      if (responseHeaders['content-type']) res.setHeader('Content-Type', responseHeaders['content-type']);
      if (responseHeaders['content-length']) res.setHeader('Content-Length', responseHeaders['content-length']);
      if (responseHeaders['content-range']) res.setHeader('Content-Range', responseHeaders['content-range']);
      if (responseHeaders['accept-ranges']) res.setHeader('Accept-Ranges', responseHeaders['accept-ranges']);
      
      // Ensure we don't cache this too much
      res.setHeader('Cache-Control', 'no-cache');

      response.data.pipe(res);
    } catch (error: any) {
      console.error(`Proxy error for file ${fileId}:`, error.message);
      res.status(500).send("Error streaming audio from Google Drive");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
