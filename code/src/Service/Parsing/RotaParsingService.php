<?php

namespace App\Service\Parsing;

use App\Entity\ActualShift;
use App\Entity\PlannedShift;
use App\Entity\Rota;
use App\Repository\RotaRepository;
use App\Repository\StaffMemberRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaParsingService {

    private const UPDATE__BASE = 'update_base';
    private const UPDATE__STATUS = 'update_status';
    private const UPDATE__CONSTANTS = 'update_constants';
    private const UPDATE__PLANNED_SHIFTS = 'update_planned_shifts';
    private const UPDATE__ACTUAL_SHIFTS = 'update_actual_shifts';

    const UPDATE_ALL = [self::UPDATE__ACTUAL_SHIFTS, self::UPDATE__BASE, self::UPDATE__CONSTANTS, self::UPDATE__PLANNED_SHIFTS, self::UPDATE__STATUS];
    const UPDATE_SHIFTS_AND_STATUS = [self::UPDATE__STATUS, self::UPDATE__PLANNED_SHIFTS, self::UPDATE__ACTUAL_SHIFTS];
    const UPDATE_CONSTANTS_AND_NON_NESTED = [self::UPDATE__BASE, self::UPDATE__CONSTANTS];

    const PARAM__DATE = 'date';
    const PARAM__FORECAST_REVENUE = 'forecastRevenue';
    const PARAM__TARGET_LABOUR_RATE = 'targetLabourRate';
    const PARAM__CONSTANTS = 'constants';
    const PARAM__STATUS = 'status';
    const PARAM__PLANNED_SHIFTS = 'plannedShifts';
    const PARAM__ACTUAL_SHIFTS = 'actualShifts';
    const PARAM__ID = 'id';

    const NEW_ROTA_ID = -1;

    /** @var RotaRepository */
    private $rotaRepository;
    /** @var PlannedShiftParsingService */
    private $plannedShiftParsingService;
    /** @var ActualShiftParsingService */
    private $actualShiftParsingService;
    /** @var ConstantsParsingService */
    private $constantsParsingService;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(RotaRepository $rotaRepository, PlannedShiftParsingService $plannedShiftParsingService, ActualShiftParsingService $actualShiftParsingService, ConstantsParsingService $constantsParsingService, StaffMemberRepository $staffMemberRepository, RequestValidator $requestValidator) {
        $this->rotaRepository = $rotaRepository;
        $this->plannedShiftParsingService = $plannedShiftParsingService;
        $this->actualShiftParsingService = $actualShiftParsingService;
        $this->constantsParsingService = $constantsParsingService;
        $this->staffMemberRepository = $staffMemberRepository;
        $this->requestValidator = $requestValidator;
    }

    public function getUpdatedRotaEntity(array $request, array $updateFields = self::UPDATE_ALL) {
        $this->validateRequestFields($request, $updateFields);
        if (!array_key_exists(self::PARAM__ID, $request)) {
            throw new BadRequestHttpException('Can not update a rota without an id');
        }
        $id = (int) $request[self::PARAM__ID];
        $rota = $this->rotaRepository->getById($id);
        if (is_null($rota)) {
            throw new BadRequestHttpException("Rota with id ${$id} does not exist");
        }

        if ($this->shouldUpdateField(self::UPDATE__BASE, $updateFields)) {
            $rota->setDate(new DateTime($request[self::PARAM__DATE]));
            $rota->setForecastRevenue((float)$request[self::PARAM__FORECAST_REVENUE]);
            $rota->setTargetLabourRate((float)$request[self::PARAM__TARGET_LABOUR_RATE]);
        }
        if ($this->shouldUpdateField(self::UPDATE__BASE, $updateFields) !== false || array_search(self::UPDATE__STATUS, $updateFields) !== false) {
            $rota->setStatus($request[self::PARAM__STATUS]);
        }

        if ($this->shouldUpdateField(self::UPDATE__CONSTANTS, $updateFields)) {
            $constants = $request[self::PARAM__CONSTANTS];
            if (array_key_exists('id', $constants)) {
                $rota->setConstants($this->constantsParsingService->getUpdatedConstantsEntity($constants));
            } else {
                throw new BadRequestHttpException('Constants ID missing in request. Can not create a new constants entity when creating a rota');
            }
        }

        if ($this->shouldUpdateField(self::UPDATE__PLANNED_SHIFTS, $updateFields)) {
            $plannedShifts = $rota->getPlannedShifts();
            foreach ($plannedShifts->toArray() as $plannedShift) {
                /** @var PlannedShift $plannedShift */
                $exists = false;
                foreach ($request[self::PARAM__PLANNED_SHIFTS] as $requestedShift) {
                    if (array_key_exists('id', $requestedShift) && $plannedShift->getId() === $requestedShift['id']) {
                        $exists = true;
                    }
                }
                if (!$exists) {
                    $rota->removePlannedShift($plannedShift);
                }
            }
            foreach ($request[self::PARAM__PLANNED_SHIFTS] as $plannedShift) {
                /** @var array $plannedShift */
                if (array_key_exists('id', $plannedShift)) {
                    $id = $plannedShift['id'];
                    $plannedShifts = $rota->getPlannedShifts()->filter(function (PlannedShift $plannedShift) use ($id) {
                        return $plannedShift->getId() === $id;
                    });
                    if (count($plannedShifts) === 0) {
                        throw new BadRequestHttpException("Planned shift with id ${$id} must exist to update it");
                    }

                    $this->plannedShiftParsingService->getUpdatedPlannedShiftEntity($plannedShift, $plannedShifts->first());
                } else {
                    $rota->addPlannedShift($this->plannedShiftParsingService->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
                }
            }
        }

        if ($this->shouldUpdateField(self::UPDATE__ACTUAL_SHIFTS, $updateFields)) {
            $actualShifts = $rota->getActualShifts();
            foreach ($actualShifts->toArray() as $actualShift) {
                /** @var ActualShift $actualShift */
                $exists = false;
                foreach ($request[self::PARAM__ACTUAL_SHIFTS] as $requestedShift) {
                    if (array_key_exists('id', $requestedShift) && $actualShift->getId() === $requestedShift['id']) {
                        $exists = true;
                    }
                }
                if (!$exists) {
                    $rota->removeActualShift($actualShift);
                }
            }
            foreach ($request[self::PARAM__ACTUAL_SHIFTS] as $actualShift) {
                /** @var array $actualShift */
                if (array_key_exists('id', $actualShift)) {
                    $id = $actualShift['id'];
                    $actualShifts = $rota->getActualShifts()->filter(function (ActualShift $actualShift) use ($id) {
                        return $actualShift->getId() === $id;
                    });
                    if (count($actualShifts) === 0) {
                        throw new BadRequestHttpException("Actual shift with id ${$id} must exist to update it");
                    }
                    $this->actualShiftParsingService->getUpdatedActualShiftEntity($actualShift, $actualShifts->first());
                } else {
                    $rota->addActualShift($this->actualShiftParsingService->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
                }
            }
        }

        return $rota;
    }

    private function shouldUpdateField(string $field, array $requestedFields) {
        return array_search($field, $requestedFields) !== false;
    }

    public function getNewRotaEntity(array $request) {
        $this->validateRequestFields($request, self::UPDATE_ALL);
        $rota = new Rota();
        $rota->setDate(new DateTime($request[self::PARAM__DATE]));
        $rota->setForecastRevenue((float) $request[self::PARAM__FORECAST_REVENUE]);
        $rota->setTargetLabourRate((float) $request[self::PARAM__TARGET_LABOUR_RATE]);
        $rota->setStatus($request[self::PARAM__STATUS]);

        $constants = $request[self::PARAM__CONSTANTS];
        if (array_key_exists('id', $constants)) {
            $rota->setConstants($this->constantsParsingService->getUpdatedConstantsEntity($constants));
        } else {
            throw new BadRequestHttpException('Can not create a new constants entity when creating a rota');
        }

        foreach($request[self::PARAM__PLANNED_SHIFTS] as $plannedShift) {
            if (array_key_exists('id', $plannedShift)) {
                throw new BadRequestHttpException('Can not re-use an existing planned shift entity when creating a new rota');
            } else {
                $rota->addPlannedShift($this->plannedShiftParsingService->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
            }
        }

        foreach($request[self::PARAM__ACTUAL_SHIFTS] as $actualShift) {
            if (array_key_exists('id', $actualShift)) {
                throw new BadRequestHttpException('Can not re-use an existing actual shift entity when creating a new rota');
            } else {
                $rota->addActualShift($this->actualShiftParsingService->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
            }
        }

        return $rota;
    }

    private function validateRequestFields(array $request, array $updateFields) {
        $validateFields = $this->getAllObjectFieldsFromRequiredFieldGroups($updateFields);
        $this->requestValidator->validateRequestFields($request, $validateFields);
        if (array_key_exists(self::PARAM__PLANNED_SHIFTS, $validateFields)) {
            foreach ($request[self::PARAM__PLANNED_SHIFTS] as $index => $plannedShift) {
                $this->plannedShiftParsingService->validateRequestFields($plannedShift);
            }
        }
        if (array_key_exists(self::PARAM__ACTUAL_SHIFTS, $validateFields)) {
            foreach ($request[self::PARAM__ACTUAL_SHIFTS] as $index => $actualShift) {
                $this->actualShiftParsingService->validateRequestFields($actualShift);
            }
        }
    }

    private function getAllObjectFieldsFromRequiredFieldGroups(array $updateFields): array {
        $validateFields = [];
        foreach ($updateFields as $updateField) {
            switch ($updateField) {
                case self::UPDATE__STATUS:
                    if (!array_key_exists(self::PARAM__STATUS, $validateFields)) {
                        $validateFields[] = self::PARAM__STATUS;
                    }
                    break;
                case self::UPDATE__BASE:
                    $validateFields[] = self::PARAM__DATE;
                    $validateFields[] = self::PARAM__FORECAST_REVENUE;
                    $validateFields[] = self::PARAM__TARGET_LABOUR_RATE;
                    if (!array_key_exists(self::PARAM__STATUS, $validateFields)) {
                        $validateFields[] = self::PARAM__STATUS;
                    }
                    break;
                case self::UPDATE__CONSTANTS:
                    $validateFields[] = self::PARAM__CONSTANTS;
                    break;
                case self::UPDATE__ACTUAL_SHIFTS:
                    $validateFields[] = self::PARAM__ACTUAL_SHIFTS;
                    break;
                case self::UPDATE__PLANNED_SHIFTS:
                    $validateFields[] = self::PARAM__PLANNED_SHIFTS;
                    break;
            }
        }
        return $validateFields;
    }
}