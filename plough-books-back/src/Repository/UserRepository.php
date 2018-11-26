<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function getByEmail($email): User {
        $user = $this->findOneBy(["email" => strtolower($email)]);
        if ($user === null) {
            return $this->getPlaceholderUser();
        }
        return $user;
    }

    public function getById($id): User {
        $user = $this->find($id);
        if ($user === null) {
            return $this->getPlaceholderUser();
        }
        return $user;
    }

    public static function getPlaceholderUser(): User {
        $user = new User();
        $user->setEmail("User not found");
        $user->setWhitelisted(false);
        $user->setBlacklisted(true);
        $user->setPlaceholder(true);
        $user->setRole(UserRoleRepository::getPlaceholderRole());
        return $user;
    }
}
