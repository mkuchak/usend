export async function generateRSAKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKey(key, type) {
  const format = type === "public" ? "spki" : "pkcs8";
  const exportedKey = await crypto.subtle.exportKey(format, key);
  const exportedKeyBuffer = new Uint8Array(exportedKey);
  const exportedKeyBase64 = btoa(
    String.fromCharCode.apply(null, exportedKeyBuffer)
  );

  return exportedKeyBase64;
}
