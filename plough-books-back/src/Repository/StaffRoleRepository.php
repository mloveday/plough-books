<?php

namespace App\Repository;

use App\Entity\StaffRole;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method StaffRole|null find($id, $lockMode = null, $lockVersion = null)
 * @method StaffRole|null findOneBy(array $criteria, array $orderBy = null)
 * @method StaffRole[]    findAll()
 * @method StaffRole[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffRoleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, StaffRole::class);
    }
}
