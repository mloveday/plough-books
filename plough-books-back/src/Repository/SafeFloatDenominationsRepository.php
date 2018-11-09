<?php

namespace App\Repository;

use App\Entity\SafeFloatDenominations;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method SafeFloatDenominations|null find($id, $lockMode = null, $lockVersion = null)
 * @method SafeFloatDenominations|null findOneBy(array $criteria, array $orderBy = null)
 * @method SafeFloatDenominations[]    findAll()
 * @method SafeFloatDenominations[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SafeFloatDenominationsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SafeFloatDenominations::class);
    }
}
