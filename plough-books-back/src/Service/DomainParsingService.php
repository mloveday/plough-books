<?php

namespace App\Service;

use App\Entity\Domain;
use App\Repository\DomainRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class DomainParsingService {

    /** @var DomainRepository */
    private $domainRepository;

    public function __construct(DomainRepository $domainRepository) {
        $this->domainRepository = $domainRepository;
    }

    public function getUpdatedDomainEntity(Request $request): Domain
    {
        $domain = $this->domainRepository->getById($request->request->get('id'));
        if ($domain->isPlaceholder()) {
            throw new BadRequestHttpException("Domain with given ID does not exist");
        }
        $domain->setDomain($request->request->get('domain'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'));
        return $domain;
    }

    public function getNewDomainEntity(Request $request): Domain
    {
        $existingDomain = $this->domainRepository->getByDomain($request->request->get('domain'));
        if (!$existingDomain->isPlaceholder()) {
            throw new BadRequestHttpException("Domain already exists (id={$existingDomain->getId()})");
        }
        $domain = new Domain();
        $domain->setDomain($request->request->get('domain'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'));
        return $domain;
    }

    public function getDomainEntityForDeletion(Request $request): Domain
    {
        $domain = $this->domainRepository->getById($request->request->get('id'));
        if ($domain->isPlaceholder()) {
            throw new BadRequestHttpException("Domain with given ID does not exist");
        }
        return $domain;
    }
}