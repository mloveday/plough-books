<?php

namespace App\Repository;

use App\Entity\RotaStaffing;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method RotaStaffing|null find($id, $lockMode = null, $lockVersion = null)
 * @method RotaStaffing|null findOneBy(array $criteria, array $orderBy = null)
 * @method RotaStaffing[]    findAll()
 * @method RotaStaffing[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RotaStaffingRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, RotaStaffing::class);
    }

//    /**
//     * @return RotaStaffing[] Returns an array of RotaStaffing objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?RotaStaffing
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
