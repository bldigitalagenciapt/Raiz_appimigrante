/**
 * Utilitário de criptografia client-side para o VOY App.
 * Usa AES-GCM para garantir confidencialidade e integridade.
 */

async function getEncryptionKey(userId: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(userId), // No futuro, usar uma derivação de chave mais robusta (PBKDF2)
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: enc.encode('voy-salt-2026'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encryptData(data: string, userId: string): Promise<string> {
    if (!data) return '';
    const key = await getEncryptionKey(userId);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();

    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(data)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decryptData(encryptedBase64: string, userId: string): Promise<string> {
    if (!encryptedBase64) return '';
    try {
        const combined = new Uint8Array(
            atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
        );
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        const key = await getEncryptionKey(userId);

        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error('Falha na descriptografia. Verifique se o ID do usuário está correto.', e);
        return '[DADO PROTEGIDO]';
    }
}
