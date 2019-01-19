<?php

namespace App\Repository;

use App\Entity\PlannedShift;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PlannedShift|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlannedShift|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlannedShift[]    findAll()
 * @method PlannedShift[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlannedShiftRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PlannedShift::class);
    }

    public function findByRotaIdAndStaffMemberId(int $rotaId, int $staffMemberId): PlannedShift {
        return $this->getEntityManager()
            ->createQuery('SELECT ps FROM App\Entity\PlannedShift ps JOIN ps.staff_member sm JOIN ps.rota r WHERE r.id = :rid AND sm.id = :smid LIMIT 1')
            ->setParameter('rid', $rotaId)
            ->setParameter('smid', $staffMemberId)
            ->execute()
            ;

    }
}
