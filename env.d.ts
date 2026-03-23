// Augment the CloudflareEnv interface from @cloudflare/next-on-pages
// with the D1 binding and secrets declared in wrangler.toml.
interface CloudflareEnv {
  DB: D1Database;
  CLAUDE_API_KEY?: string;
}
