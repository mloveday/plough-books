<?php

namespace App\Repository;

use App\Entity\StaffMember;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method StaffMember|null find($id, $lockMode = null, $lockVersion = null)
 * @method StaffMember|null findOneBy(array $criteria, array $orderBy = null)
 * @method StaffMember[]    findAll()
 * @method StaffMember[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffMemberRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, StaffMember::class);
    }

    public function getById(int $id) {
        return $this->findOneBy(['id' => $id]);
    }
}
