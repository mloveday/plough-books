<?php

namespace App\Repository;

use App\Entity\CashUpChange;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CashUpChange|null find($id, $lockMode = null, $lockVersion = null)
 * @method CashUpChange|null findOneBy(array $criteria, array $orderBy = null)
 * @method CashUpChange[]    findAll()
 * @method CashUpChange[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CashUpChangeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CashUpChange::class);
    }

//    /**
//     * @return Change[] Returns an array of Change objects
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
    public function findOneBySomeField($value): ?Change
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
