import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import "dotenv/config";

const PAGE_ID = process.env.CONFLUENCE_PAGE_ID;
const EMAIL = process.env.CONFLUENCE_EMAIL;
const TOKEN = process.env.CONFLUENCE_API_TOKEN;

const AUTH_HEADER =
  "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

const CONFLUENCE_BASE = "https://dzeny.atlassian.net/";

const fetchPageContent = async () => {
  console.log(PAGE_ID, EMAIL, TOKEN);
  const res = await fetch(
    `${CONFLUENCE_BASE}/wiki/rest/api/content/${PAGE_ID}?expand=body.storage`,
    {
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await res.json();
  return json.body.storage.value;
};

const extractJsonBlock = (html) => {
  const match = html.match(/<!\[CDATA\[(.*?)\]\]>/s); // s = multiline

  if (!match || !match[1]) {
    throw new Error("❌ JSON CDATA block not found");
  }

  const raw = match[1].trim();

  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error("❌ Failed to parse JSON from Confluence");
  }
};

const saveResources = (lang, resources) => {
  Object.entries(resources).forEach(([namespace, content]) => {
    const dir = path.join("public", "i18n", lang);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, `${namespace}.json`);
    fs.writeFileSync(file, JSON.stringify(content, null, 2), "utf-8");
    console.log(`✅ Saved ${file}`);
  });
};

(async () => {
  try {
    const html = await fetchPageContent();
    const parsed = extractJsonBlock(html);

    const isMultiLang =
      Object.values(parsed)[0] &&
      typeof Object.values(parsed)[0] === "object" &&
      Object.values(parsed)[0].title;

    if (isMultiLang) {
      const lang = process.env.LANG || "en";
      saveResources(lang, parsed);
    } else {
      Object.entries(parsed).forEach(([lang, resources]) => {
        saveResources(lang, resources);
      });
    }

    console.log("🎉 Done.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
