// EncryptionService.ts

export async function encryptHybrid(
  plaintext: string,
  base64PublicKey: string
): Promise<string> {
  try {
    // 1) Decode SPKI public key (base64) to ArrayBuffer
    const publicKeyBytes = base64ToArrayBuffer(base64PublicKey);

    // 2) Import RSA-OAEP public key (SHA-256)
    const publicKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBytes,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    // 3) Generate AES-256-GCM key
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // 4) Nonce/IV: 12 bytes for GCM
    const nonce = crypto.getRandomValues(new Uint8Array(12));

    // 5) Encrypt plaintext with AES-GCM
    const plaintextBytes = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      aesKey,
      plaintextBytes
    );

    // 6) Export raw AES key bytes
    const aesKeyBytes = await crypto.subtle.exportKey("raw", aesKey);

    // 7) Encrypt AES key with RSA-OAEP
    const encryptedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      aesKeyBytes
    );

    // 8) Build payload and return base64(JSON)
    const payload = {
      encryptedKey: arrayBufferToBase64(encryptedKey),
      nonce: arrayBufferToBase64(nonce),
      ciphertext: arrayBufferToBase64(ciphertext),
    };

    const json = JSON.stringify(payload);
    return stringToBase64(json);
  } catch (err: any) {
    throw new Error(`Encryption failed: ${err?.message ?? String(err)}`);
  }
}

/* ---------- helpers (RN-safe) ---------- */

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Ensure plain ArrayBuffer (not SharedArrayBuffer / ArrayBufferLike)
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf).buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes).toString("base64");
}

export function stringToBase64(s: string): string {
  return Buffer.from(s, "utf8").toString("base64");
}

export function base64ToString(b64: string): string {
  return Buffer.from(b64, "base64").toString("utf8");
}
