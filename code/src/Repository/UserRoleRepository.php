<?php

namespace App\Repository;

use App\Entity\Role;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Role|null find($id, $lockMode = null, $lockVersion = null)
 * @method Role|null findOneBy(array $criteria, array $orderBy = null)
 * @method Role[]    findAll()
 * @method Role[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRoleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Role::class);
    }

    public function getByRole($roleName)
    {
        $role = $this->findOneBy(['role' => $roleName]);
        if ($role === null) {
            return $this->getPlaceholderRole();
        }
        return $role;
    }

    public function getById($id)
    {
        $role = $this->find($id);
        if ($role === null) {
            return $this->getPlaceholderRole();
        }
        return $role;
    }

    public static function getPlaceholderRole(): Role
    {
        $role = new Role();
        $role->setManagesUsers(false)
            ->setRole("Role not found")
            ->setPlaceholder(true);
        return $role;
    }
}
