<?php

namespace App\Repository;

use App\Entity\Domain;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Domain|null find($id, $lockMode = null, $lockVersion = null)
 * @method Domain|null findOneBy(array $criteria, array $orderBy = null)
 * @method Domain[]    findAll()
 * @method Domain[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DomainRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Domain::class);
    }

    public function getByDomain($domain)
    {
        $domainEntity = $this->findOneBy(["domain" => strtolower($domain)]);
        if ($domainEntity === null) {
            return $this->getPlaceholderDomain();
        }
        return $domainEntity;
    }

    public function getById($id) {
        $domainEntity = $this->find($id);
        if ($domainEntity === null) {
            return $this->getPlaceholderDomain();
        }
        return $domainEntity;
    }

    /**
     * @return Domain
     */
    public function getPlaceholderDomain(): Domain
    {
        $blankDomain = new Domain();
        $blankDomain->setBlacklisted(false);
        $blankDomain->setWhitelisted(false);
        $blankDomain->setDomain("Domain not found");
        $blankDomain->setDomainPlaceholder(true);
        return $blankDomain;
    }
}
