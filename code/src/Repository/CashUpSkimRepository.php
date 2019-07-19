<?php

namespace App\Repository;

use App\Entity\CashUpSkim;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CashUpSkim|null find($id, $lockMode = null, $lockVersion = null)
 * @method CashUpSkim|null findOneBy(array $criteria, array $orderBy = null)
 * @method CashUpSkim[]    findAll()
 * @method CashUpSkim[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CashUpSkimRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CashUpSkim::class);
    }

//    /**
//     * @return Skim[] Returns an array of Skim objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Skim
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
