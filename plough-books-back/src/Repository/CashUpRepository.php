<?php

namespace App\Repository;

use App\Entity\CashUp;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CashUp|null find($id, $lockMode = null, $lockVersion = null)
 * @method CashUp|null findOneBy(array $criteria, array $orderBy = null)
 * @method CashUp[]    findAll()
 * @method CashUp[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CashUpRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CashUp::class);
    }

    public function getWeekByDate(DateTime $date) {
        $date->setTime(0,0,0,0);
        $criteria = Criteria::create();
        return $this->matching(
            $criteria->where(Criteria::expr()->gte('date', clone $date->modify('Monday this week')))
                ->andWhere(Criteria::expr()->lte('date', clone $date->modify('Sunday this week')))
        );
    }

    public function getByDate(DateTime $date) {
        $date->setTime(0,0,0,0);
        return $this->findOneBy(['date' => $date]);
    }

    public function getById($id) {
        return $this->findOneBy(['id' => $id]);
    }
}
