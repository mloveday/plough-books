<?php
namespace App\Service;

use App\Repository\UserDomainRepository;
use App\Repository\UserRepository;
use Doctrine\DBAL\Driver\Connection;

class AccessControlService {

    const EMAIL_REGEX = '/([a-z0-9._%+-]+@)([a-z0-9.-]+\.[a-z]{2,})/';

    private $connection;
    private $userRepository;
    private $domainRepository;

    public function __construct(Connection $connection, UserRepository $userRepository, UserDomainRepository $domainRepository) {
        $this->connection = $connection;
        $this->userRepository = $userRepository;
        $this->domainRepository = $domainRepository;
    }

    public function isAllowedAccess($email) {
        if (!$this->isEmailValid($email)) {
            return false;
        }
        $user = $this->userRepository->getByEmail($email);
        $domainRights = $this->getDomainRightsFromEmail($email);

        if ($user->getBlacklisted() || (!$user->getWhitelisted() && $domainRights->getBlacklisted())) {
            return false;
        }

        if ($user->getWhitelisted() || $domainRights->getWhitelisted()) {
            return true;
        }

        return false;
    }

    private function isEmailValid($email) {
        return preg_match(self::EMAIL_REGEX, $email, $matches) === 1;
    }
    
    private function getDomainFromEmail($email) {
        preg_match(self::EMAIL_REGEX, $email, $matches);
        return $matches[2];
    }

    private function getDomainRightsFromEmail($email) {
        $email = strtolower($email);
        if (!$this->isEmailValid($email)) {
            return false;
        }
        $domain = $this->getDomainFromEmail($email);
        return $this->domainRepository->getByDomain($domain);
    }

    public function canManageUsers($email) {
        $user = $this->userRepository->getByEmail($email);
        return $user->getRole()->getManagesUsers();
    }
}