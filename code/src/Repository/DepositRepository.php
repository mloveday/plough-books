<?php

namespace App\Repository;

use App\Entity\Deposit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Deposit|null find($id, $lockMode = null, $lockVersion = null)
 * @method Deposit|null findOneBy(array $criteria, array $orderBy = null)
 * @method Deposit[]    findAll()
 * @method Deposit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DepositRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Deposit::class);
    }
}
