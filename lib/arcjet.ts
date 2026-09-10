import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  // Rate limiting is applied PER AUTHENTICATED USER, not per account.
// Each user gets an independent token bucket.
// All transaction-creation requests from the same user share that bucket,
// regardless of which NeuroFin account they belong to.

// Real Meaning:
//A user's Arcjet token bucket can hold up to 10 tokens, 
// and each protected request consumes 1 token. 
// Tokens are replenished according to the configured 10-per-minute rate.
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: "1m",
      capacity: 10,
    }),
  ],
});