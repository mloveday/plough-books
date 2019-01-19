<?php

namespace App\Repository;

use App\Entity\TillDenominations;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method TillDenominations|null find($id, $lockMode = null, $lockVersion = null)
 * @method TillDenominations|null findOneBy(array $criteria, array $orderBy = null)
 * @method TillDenominations[]    findAll()
 * @method TillDenominations[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TillDenominationsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, TillDenominations::class);
    }
}
