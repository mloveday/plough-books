<?php

namespace App\Service\Persistence;

use App\Entity\CashUp;
use Doctrine\ORM\EntityManagerInterface;

class CashUpPersistenceService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function persistCashUp(CashUp $cashUp)
    {
        $this->entityManager->persist($cashUp);
        $this->entityManager->flush();
    }
}