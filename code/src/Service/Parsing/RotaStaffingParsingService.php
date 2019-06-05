<?php

namespace App\Service\Parsing;

use App\Entity\RotaStaffing;
use App\Repository\RotaStaffingRepository;
use App\Util\RequestValidator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaStaffingParsingService {

    /** @var RotaStaffingRepository */
    private $rotaStaffingRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(RotaStaffingRepository $rotaStaffingRepository, RequestValidator $requestValidator) {
        $this->rotaStaffingRepository = $rotaStaffingRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [
            'staffLevels',
            'revenue',
            'workType',
            'dayOfWeek',
        ]);
    }

    public function getNewRotaStaffingEntity(array $rotaStaffing) {
        if (array_key_exists('id', $rotaStaffing)) {
            throw new BadRequestHttpException("New RotaStaffing entity in request should not have an id");
        }
        return $this->updateRotaStaffingEntity($rotaStaffing, new RotaStaffing());
    }

    public function getUpdatedRotaStaffingEntity(array $rotaStaffing) {
        if (!array_key_exists('id', $rotaStaffing)) {
            throw new BadRequestHttpException("Existing RotaStaffing entity in request has no id");
        }
        $entity = $this->rotaStaffingRepository->findOneBy(['id' => $rotaStaffing['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("RotaStaffing with id ${$rotaStaffing['id']} does not exist");
        }
        return $this->updateRotaStaffingEntity($rotaStaffing, $entity);
    }

    private function updateRotaStaffingEntity(array $rotaStaffing, RotaStaffing $entity) {
        return $entity
            ->setStaffLevels($rotaStaffing['staffLevels'])
            ->setWorkType((float)$rotaStaffing['workType']);
    }
}