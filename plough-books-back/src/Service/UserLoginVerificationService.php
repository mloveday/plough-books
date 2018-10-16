<?php

namespace App\Service;

use Exception;
use Google_Client;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserLoginVerificationService
{
    private $filesystemCache;

    public function __construct() {
        $this->filesystemCache = new FilesystemCache();
    }

    public function getUserPayload(string $token)
    {
        $cacheKey = 'gtoken.' . $token;
        if ($this->filesystemCache->has($cacheKey)) {
            try {
                $payload = unserialize($this->filesystemCache->get($cacheKey));
                if ((int)$payload['exp'] > time()) {
                    return $payload;
                }
                $this->filesystemCache->delete($cacheKey);
            } catch (Exception $e) {
                // do nothing - this is in case of a change in what we're storing in the cache.
                // we re-validate, fetch and set token in cache below
            }
        }

        try {
            $client = new Google_Client(['client_id' => '491973077715-1oqkalirg0v7gmdrehuv605nf3sju2si.apps.googleusercontent.com']);
            $payload = $client->verifyIdToken($token);
            $this->filesystemCache->set($cacheKey, serialize($payload));
        } catch (\Exception $e) {
            throw new UnauthorizedHttpException('','could not validate token', $e);
        }
        if (!$payload) {
            throw new UnauthorizedHttpException('','supplied authentication token is not valid');
        }
        return $payload;
    }
}