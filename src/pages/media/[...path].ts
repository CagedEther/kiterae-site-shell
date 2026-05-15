import { readdir, readFile } from "node:fs/promises";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const mediaRoot = fileURLToPath(new URL("../../../content/images/", import.meta.url));
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function collectMediaPaths(dir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) return collectMediaPaths(fullPath, nextPrefix);
      if (allowedExtensions.has(extname(entry.name).toLowerCase())) return [nextPrefix];
      return [];
    }),
  );

  return paths.flat();
}

export async function getStaticPaths() {
  const mediaPaths = await collectMediaPaths(mediaRoot);
  return mediaPaths.map((path) => ({ params: { path } }));
}

export async function GET({ params }: { params: { path?: string } }) {
  const requestedPath = params.path ?? "";
  const safePath = normalize(requestedPath);
  const fullPath = join(mediaRoot, safePath);
  const rel = relative(mediaRoot, fullPath);

  if (rel.startsWith("..") || rel === "" || rel.startsWith("/")) {
    return new Response("Not found", { status: 404 });
  }

  const ext = extname(fullPath).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return new Response("Unsupported media type", { status: 415 });
  }

  const body = await readFile(fullPath);
  return new Response(body, {
    headers: {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
