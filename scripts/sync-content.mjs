import { execSync } from "child_process";
import { cpSync, rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const REPO = "CagedEther/kiterae-site-shell";
const TMP = "/tmp/kiterae-content-sync";
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

console.log("Syncing content from GitHub...");

if (existsSync(TMP)) {
  rmSync(TMP, { recursive: true });
}

execSync(
  `git clone --depth 1 --filter=blob:none --sparse https://github.com/${REPO}.git ${TMP}`,
  { stdio: "inherit" }
);
execSync(`git -C ${TMP} sparse-checkout set content`, { stdio: "inherit" });

const dest = join(ROOT, "content");
if (existsSync(dest)) {
  rmSync(dest, { recursive: true });
}
cpSync(join(TMP, "content"), dest, { recursive: true });

console.log("Content synced from GitHub successfully.");
