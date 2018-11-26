<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;

class PersistenceService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function persist($entity)
    {
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
    }

    public function delete($entity)
    {
        $this->entityManager->remove($entity);
        $this->entityManager->flush();
    }
}