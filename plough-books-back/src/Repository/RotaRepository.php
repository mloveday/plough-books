<?php

namespace App\Repository;

use App\Entity\Rota;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Rota|null find($id, $lockMode = null, $lockVersion = null)
 * @method Rota|null findOneBy(array $criteria, array $orderBy = null)
 * @method Rota[]    findAll()
 * @method Rota[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RotaRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Rota::class);
    }

    public function getWeekByDate(DateTime $date) {
        $date->setTime(0,0,0,0);
        $criteria = Criteria::create();
        return $this->matching(
            $criteria->where(Criteria::expr()->gte('date', clone $date->modify('Monday this week')))
                ->andWhere(Criteria::expr()->lte('date', clone $date->modify('Sunday this week')))
        );
    }

    public function getByDateAndType(DateTime $date, $type) {
        $date->setTime(0,0,0,0);
        return $this->findOneBy(['date' => $date, 'type' => $type]);
    }

    public function getById($id) {
        return $this->findOneBy(['id' => $id]);
    }
}
