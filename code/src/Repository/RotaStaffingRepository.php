<?php

namespace App\Repository;

use App\Entity\RotaStaffingTemplate;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method RotaStaffingTemplate|null find($id, $lockMode = null, $lockVersion = null)
 * @method RotaStaffingTemplate|null findOneBy(array $criteria, array $orderBy = null)
 * @method RotaStaffingTemplate[]    findAll()
 * @method RotaStaffingTemplate[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RotaStaffingRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, RotaStaffingTemplate::class);
    }

//    /**
//     * @return RotaStaffingTemplate[] Returns an array of RotaStaffingTemplate objects
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
    public function findOneBySomeField($value): ?RotaStaffingTemplate
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
