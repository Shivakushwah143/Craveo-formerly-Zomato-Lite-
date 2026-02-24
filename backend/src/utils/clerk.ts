import axios from "axios";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";

export interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

export interface ClerkUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
}

const clerkIssuer = process.env.CLERK_ISSUER;
const clerkJwksUrl =
  process.env.CLERK_JWKS_URL ||
  (clerkIssuer ? `${clerkIssuer}/.well-known/jwks.json` : undefined);

const jwksClient = clerkJwksUrl
  ? jwksRsa({
      jwksUri: clerkJwksUrl,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    })
  : null;

export const verifyClerkJwt = (token: string): Promise<any | null> => {
  if (!jwksClient || !clerkIssuer) return Promise.resolve(null);

  return new Promise((resolve) => {
    const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
      if (!header.kid) {
        callback(new Error("Missing kid"));
        return;
      }

      jwksClient.getSigningKey(header.kid, (err: any, key:any) => {
        if (err || !key) {
          callback(err || new Error("Signing key not found"));
          return;
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    };

    jwt.verify(token, getKey, { issuer: clerkIssuer }, (err, decoded) => {
      if (err) return resolve(null);
      resolve(decoded);
    });
  });
};

export const fetchClerkUser = async (
  userId: string
): Promise<ClerkUser | null> => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  const apiBase = process.env.CLERK_API_BASE_URL || "https://api.clerk.com/v1";
  const response = await axios.get(`${apiBase}/users/${userId}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  return response.data as ClerkUser;
};
