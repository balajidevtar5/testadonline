import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { postId } = req.query;
  console.log("Vercel hit with postId:", postId);

  const distPath = path.resolve("./build");
  const indexFile = path.join(distPath, "index.html");
  let html = fs.readFileSync(indexFile, "utf8");

  const meta = {
    title: `Post ${postId}`,
    description: `This is description for post ${postId}`,
    image: `https://adonline.in/api/Uploads/S/25220/Sep292025-170506_fec.webp`,
    url: `https://yourdomain.com/share/${postId}`,
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

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
