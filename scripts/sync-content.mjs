import { execSync } from "child_process";
  import { cpSync, rmSync, existsSync } from "fs";
  import { join, dirname } from "path";
  import { fileURLToPath } from "url";

  // Configure via env vars before running:
  //   CONTENT_REPO   — GitHub repo containing your content, e.g. "owner/repo"
  //   CONTENT_PATH   — path inside that repo to the content folder, e.g. "my-site/content"
  //
  // Example:
  //   CONTENT_REPO=CagedEther/kiterae-sites CONTENT_PATH=pageant-insider-agent/content npm run sync-content

  const REPO = process.env.CONTENT_REPO || "";
  const CONTENT_PATH = process.env.CONTENT_PATH || "content";
  const TMP = "/tmp/kiterae-content-sync";
  const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

  if (!REPO) {
    console.error(
      "Error: set CONTENT_REPO before running.\n" +
      "  Example: CONTENT_REPO=owner/repo CONTENT_PATH=site/content npm run sync-content"
    );
    process.exit(1);
  }

  console.log(`Syncing content from ${REPO}/${CONTENT_PATH}...`);

  if (existsSync(TMP)) {
    rmSync(TMP, { recursive: true });
  }

  execSync(
    `git clone --depth 1 --filter=blob:none --sparse https://github.com/${REPO}.git ${TMP}`,
    { stdio: "inherit" }
  );
  execSync(`git -C ${TMP} sparse-checkout set ${CONTENT_PATH}`, { stdio: "inherit" });

  const dest = join(ROOT, "content");
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true });
  }
  cpSync(join(TMP, CONTENT_PATH), dest, { recursive: true });

  console.log("Content synced successfully.");
  