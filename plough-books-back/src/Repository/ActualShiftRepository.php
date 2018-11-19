<?php

namespace App\Repository;

use App\Entity\ActualShift;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ActualShift|null find($id, $lockMode = null, $lockVersion = null)
 * @method ActualShift|null findOneBy(array $criteria, array $orderBy = null)
 * @method ActualShift[]    findAll()
 * @method ActualShift[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActualShiftRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ActualShift::class);
    }

    public function findByRotaIdAndStaffMemberId(int $rotaId, int $staffMemberId): ActualShift {
        return $this->getEntityManager()
            ->createQuery('SELECT as FROM App\Entity\ActualShift as JOIN as.staff_member sm JOIN as.rota r WHERE r.id = :rid AND sm.id = :smid LIMIT 1')
            ->setParameter('rid', $rotaId)
            ->setParameter('smid', $staffMemberId)
            ->execute()
            ;

    }
}
