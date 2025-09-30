import express from "express";
import path from "path";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build
app.use(express.static(path.resolve("build")));
const distPath = path.resolve("build");
// Dynamic share page
app.get("/share/:postId", (req, res) => {
  const { postId } = req.params;
  console.log("Express hit with postId:", postId);

  const indexFile = path.resolve(distPath, "index.html");
  let html = fs.readFileSync(indexFile, "utf8");
  // Inject dynamic meta
  const meta = {
    title: `Post ${postId}`,
    description: `This is description for post ${postId}`,
    image: `https://adonline.in/api//Uploads/S/25220/Sep292025-170506_fec.webp`,
    url: `https://adonline.in/api//Uploads/S/25220/Sep292025-170506_fec.webp`,
  };

  html = html.replace(
    /<title>.*<\/title>/,
    `
      <title>${meta.title}</title>
      <meta property="og:title" content="${meta.title}" />
      <meta property="og:description" content="${meta.description}" />
      <meta property="og:image" content="${meta.image}" />
      <meta property="og:url" content="${meta.url}" />
      <meta name="twitter:card" content="summary_large_image" />
    `
  );

  res.send(html);
});



// Fallback to React for other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
