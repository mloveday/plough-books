<?php

namespace App\Service;

use App\Entity\Domain;
use App\Entity\Role;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserPersistenceService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function persistUser(User $user)
    {
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function deleteUser(User $user)
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    public function persistRole(Role $role)
    {
        $this->entityManager->persist($role);
        $this->entityManager->flush();
    }

    public function deleteRole(Role $role)
    {
        $this->entityManager->remove($role);
        $this->entityManager->flush();
    }

    public function persistDomain(Domain $domain)
    {
        $this->entityManager->persist($domain);
        $this->entityManager->flush();
    }

    public function deleteDomain(Domain $domain)
    {
        $this->entityManager->remove($domain);
        $this->entityManager->flush();
    }
}