declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    OPENAI_API_KEY?: string;
    OPENAI_MODEL?: string;
    USAGE_HMAC_SECRET?: string;
    DAILY_ANALYSIS_LIMIT?: string;
    PER_VISITOR_HOURLY_LIMIT?: string;
  }
}
