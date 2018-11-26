<?php

namespace App\Service\Persistence;

use App\Entity\Rota;
use Doctrine\ORM\EntityManagerInterface;

class RotaPersistenceService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function persistRota(Rota $rota)
    {
        $this->entityManager->persist($rota);
        $this->entityManager->flush();
    }
}