<?php

namespace App\Service\Parsing;

use App\Entity\CashUpSkim;
use App\Repository\CashUpSkimRepository;
use App\Util\RequestValidator;

class SkimParsingService {
    const PARAM__INITIALS = 'initials';
    const PARAM__WITNESS = 'witness';
    const PARAM__AMOUNT = 'amount';

    /** @var CashUpSkimRepository */
    private $skimRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(CashUpSkimRepository $skimRepository, RequestValidator $requestValidator) {
        $this->skimRepository = $skimRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [self::PARAM__INITIALS, self::PARAM__WITNESS, self::PARAM__AMOUNT]);
    }

    public function getUpdatedSkimEntity(array $skim, CashUpSkim $entity) {
        return $this->updateSkimEntity($skim, $entity);
    }

    public function getNewSkimEntity(array $skim) {
        return $this->updateSkimEntity($skim, new CashUpSkim());
    }

    private function updateSkimEntity(array $skim, CashUpSkim $entity): CashUpSkim {
        return $entity
            ->setInitials($skim[self::PARAM__INITIALS])
            ->setWitness($skim[self::PARAM__WITNESS])
            ->setAmount($skim[self::PARAM__AMOUNT])
            ;
    }
}