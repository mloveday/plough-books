<?php

namespace App\Service;

use App\Repository\UserRepository;
use Exception;
use Google_Client;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserLoginVerificationService
{
    private $filesystemCache;
    private $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->filesystemCache = new FilesystemCache();
        $this->userRepository = $userRepository;
    }

    public function getAuthenticatedUserFromToken(string $token)
    {
        try {
            $payload = $this->getUserPayload($token);
            return $this->userRepository->getByEmail($payload['email']);
        } catch (Exception $e) {
            // could be an unregistered user from a whitelisted domain
            $user = UserRepository::getPlaceholderUser()
                ->setEmail("unknown user")
                ->setBlacklisted(false);
            $user->getRole()->setRole("user from whitelisted domain");
            return $user;
        }
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