<?php

namespace App\Service\Parsing;

use App\Entity\CashUpChange;
use App\Repository\CashUpChangeRepository;
use App\Util\RequestValidator;

class ChangeParsingService {
    const PARAM__INITIALS = 'initials';
    const PARAM__WITNESS = 'witness';
    const PARAM__AMOUNT = 'amount';

    /** @var CashUpChangeRepository */
    private $changeRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(CashUpChangeRepository $changeRepository, RequestValidator $requestValidator) {
        $this->changeRepository = $changeRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [self::PARAM__INITIALS, self::PARAM__WITNESS, self::PARAM__AMOUNT]);
    }

    public function getUpdatedChangeEntity(array $change, CashUpChange $entity) {
        return $this->updateChangeEntity($change, $entity);
    }

    public function getNewChangeEntity(array $change) {
        return $this->updateChangeEntity($change, new CashUpChange());
    }

    private function updateChangeEntity(array $change, CashUpChange $entity): CashUpChange {
        return $entity
            ->setInitials($change[self::PARAM__INITIALS])
            ->setWitness($change[self::PARAM__WITNESS])
            ->setAmount($change[self::PARAM__AMOUNT])
            ;
    }
}