export async function validateKeyPair(
  publicKey: string,
  privateKey: string
): Promise<boolean> {
  try {
    const publicKeyBuffer = new Uint8Array(
      Array.from(atob(publicKey)).map((char) => char.charCodeAt(0))
    );
    const privateKeyBuffer = new Uint8Array(
      Array.from(atob(privateKey)).map((char) => char.charCodeAt(0))
    );
    const importedPublicKey = await crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
    const importedPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );

    const data = new Uint8Array([0x61, 0x62, 0x63]);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      importedPublicKey,
      data
    );
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      importedPrivateKey,
      encryptedData
    );

    const areKeysCompatible =
      JSON.stringify(data) === JSON.stringify(new Uint8Array(decryptedData));

    return areKeysCompatible;
  } catch (error) {
    console.error("validateKeyPair error", error);
    return false;
  }
}
