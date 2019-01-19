<?php

namespace App\Repository;

use App\Entity\Constants;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Constants|null find($id, $lockMode = null, $lockVersion = null)
 * @method Constants|null findOneBy(array $criteria, array $orderBy = null)
 * @method Constants[]    findAll()
 * @method Constants[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConstantsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Constants::class);
    }
}
