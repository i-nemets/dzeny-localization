import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import "dotenv/config";

const PARENT_PAGE_ID = process.env.CONFLUENCE_PAGE_ID;
const EMAIL = process.env.CONFLUENCE_EMAIL;
const TOKEN = process.env.CONFLUENCE_API_TOKEN;

const AUTH_HEADER =
  "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

const CONFLUENCE_BASE = "https://dzeny.atlassian.net";

const getChildPages = async (parentId) => {
  const res = await fetch(
    `${CONFLUENCE_BASE}/wiki/rest/api/content?type=page&limit=100&expand=body.storage&ancestor=${parentId}`,
    {
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const json = await res.json();
  console.log(json);
  return json.results.map((page) => ({
    id: page.id,
    title: page.title.toLowerCase(),
    content: page.body?.storage?.value,
  }));
};

const extractJsonBlock = (html) => {
  const match = html.match(/<!\[CDATA\[(.*?)\]\]>/s);
  if (!match || !match[1]) throw new Error("❌ JSON CDATA block not found");

  try {
    return JSON.parse(match[1].trim());
  } catch (e) {
    throw new Error("❌ Failed to parse JSON from Confluence");
  }
};

const saveResources = (namespace, lang, content) => {
  const dir = path.join("public", "i18n", lang);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${namespace}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  console.log(`✅ Saved ${filePath}`);
};

(async () => {
  try {
    const pages = await getChildPages(PARENT_PAGE_ID);

    for (const { title, content } of pages) {
      if (!content) {
        console.warn(`⚠️ Skipped ${title} (no content)`);
        continue;
      }

      try {
        const data = extractJsonBlock(content);

        Object.entries(data).forEach(([lang, translations]) => {
          saveResources(title, lang, translations);
        });
      } catch (e) {
        console.warn(`⚠️ Failed to process ${title}:`, e.message);
      }
    }

    console.log("🎉 All translations synced.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
