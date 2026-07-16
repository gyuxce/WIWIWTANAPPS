<?php
namespace App\Services;

use InvalidArgumentException;
use phpseclib3\Crypt\RSA;
use phpseclib3\Crypt\PublicKeyLoader;
use RuntimeException;

class CryptoService
{

/**
 * Performs hybrid encryption using AES-GCM and RSA-OAEP
 * 
 * @param string $plaintext The text to encrypt
 * @param string $publicKeyBase64 Base64-encoded PKIX format public key
 * @return string Base64-encoded JSON result containing encrypted components
 * @throws Exception If encryption fails or invalid parameters provided
 */
function hybridEncrypt(string $plaintext, string $publicKeyBase64): string
{   
    // Decode and validate the public key
    $publicKeyPem = base64_decode($publicKeyBase64, true);
    if ($publicKeyPem === false) {
        throw new InvalidArgumentException('Invalid Base64 public key');
    }
    
    // Convert DER to PEM format if needed
    if (strpos($publicKeyPem, '-----BEGIN') === false) {
        $publicKeyPem = "-----BEGIN PUBLIC KEY-----\n" . 
                       chunk_split(base64_encode($publicKeyPem), 64, "\n") . 
                       "-----END PUBLIC KEY-----\n";
    }
    
    $publicKey = openssl_pkey_get_public($publicKeyPem);
    if ($publicKey === false) {
        throw new InvalidArgumentException('Invalid public key format');
    }
    
    try {
        // Generate secure random AES key
        $aesKey = random_bytes(32);
        
        // Generate secure random nonce for AES-GCM
        $nonce = random_bytes(12);
        
        // Encrypt plaintext using AES-GCM
        $tag = '';
        $ciphertext = openssl_encrypt(
            $plaintext, 'aes-256-gcm', $aesKey, OPENSSL_RAW_DATA, $nonce, $tag
        );
        if ($ciphertext === false) {
            throw new RuntimeException('AES-GCM encryption failed');
        }
        
        // Combine ciphertext and authentication tag
        $encryptedData = $ciphertext . $tag;
        
        // Encrypt AES key using RSA-OAEP with SHA-256
        $key = PublicKeyLoader::load($publicKeyPem)
            ->withPadding(RSA::ENCRYPTION_OAEP)
            ->withHash('sha256')
            ->withMGFHash('sha256');
        $encryptedAesKey = $key->encrypt($aesKey);
        if ($encryptedAesKey === false) {
            throw new RuntimeException('RSA-OAEP encryption failed');
        }
        
        // Construct JSON object
        $result = [
            'encryptedKey' => base64_encode($encryptedAesKey),
            'nonce' => base64_encode($nonce),
            'ciphertext' => base64_encode($encryptedData)
        ];
        
        // Encode JSON as Base64
        $jsonString = json_encode($result, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        return base64_encode($jsonString);

    } catch (\Exception $e) {
        throw new RuntimeException('Encryption failed: ' . $e->getMessage(), 0, $e);
    }
    //below is deprecated
    // } finally {
    //     // Clean up resources
    //     if (is_resource($publicKey)) {
    //         openssl_free_key($publicKey);
    //     }
    // }
}
}