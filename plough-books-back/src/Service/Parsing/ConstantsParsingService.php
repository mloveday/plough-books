<?php

namespace App\Service\Parsing;

use App\Entity\Constants;
use App\Repository\ConstantsRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ConstantsParsingService {

    /** @var ConstantsRepository */
    private $constantsRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(ConstantsRepository $constantsRepository, RequestValidator $requestValidator) {
        $this->constantsRepository = $constantsRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [
            'date',
            'barProportionOfRevenue',
            'ersPercentAboveThreshold',
            'ersThreshold',
            'fixedCosts',
            'holidayLinearPercent',
            'hoursPerLongBreak',
            'hoursPerShortBreak',
            'labourRate',
            'longBreakDuration',
            'pensionLinearPercent',
            'shortBreakDuration',
            'vatMultiplier',
        ]);
    }

    public function getNewConstantsEntity(array $constants) {
        if (array_key_exists('id', $constants)) {
            throw new BadRequestHttpException("New Constants entity in request should not have an id");
        }
        return $this->updateConstantsEntity($constants, new Constants());
    }

    public function getUpdatedConstantsEntity(array $constants) {
        if (!array_key_exists('id', $constants)) {
            throw new BadRequestHttpException("Existing Constants entity in request has no id");
        }
        $entity = $this->constantsRepository->findOneBy(['id' => $constants['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("Constants with id ${$constants['id']} does not exist");
        }
        return $this->updateConstantsEntity($constants, $entity);
    }

    private function updateConstantsEntity(array $constants, Constants $entity) {
        return $entity->setDate(new DateTime($constants['date']))
            ->setBarProportionOfRevenue((float)$constants['barProportionOfRevenue'])
            ->setErsPercentAboveThreshold((float)$constants['ersPercentAboveThreshold'])
            ->setErsThreshold((float)$constants['ersThreshold'])
            ->setFixedCosts((float)$constants['fixedCosts'])
            ->setHolidayLinearPercent((float)$constants['holidayLinearPercent'])
            ->setHoursPerLongBreak((float)$constants['hoursPerLongBreak'])
            ->setHoursPerShortBreak((float)$constants['hoursPerShortBreak'])
            ->setLabourRate((float)$constants['labourRate'])
            ->setLongBreakDuration((float)$constants['longBreakDuration'])
            ->setPensionLinearPercent((float)$constants['pensionLinearPercent'])
            ->setShortBreakDuration((float)$constants['shortBreakDuration'])
            ->setVatMultiplier((float)$constants['vatMultiplier']);
    }
}