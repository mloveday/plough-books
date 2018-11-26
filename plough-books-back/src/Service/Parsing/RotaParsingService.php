<?php

namespace App\Service\Parsing;

use App\Entity\ActualShift;
use App\Entity\PlannedShift;
use App\Entity\Rota;
use App\Repository\RotaRepository;
use App\Repository\StaffMemberRepository;
use App\Service\Parsing\ActualShiftParsingService;
use App\Service\Parsing\ConstantsParsingService;
use App\Service\Parsing\PlannedShiftParsingService;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaParsingService {

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

    public function __construct(RotaRepository $rotaRepository, PlannedShiftParsingService $plannedShiftParsingService, ActualShiftParsingService $actualShiftParsingService, ConstantsParsingService $constantsParsingService, StaffMemberRepository $staffMemberRepository) {
        $this->rotaRepository = $rotaRepository;
        $this->plannedShiftParsingService = $plannedShiftParsingService;
        $this->actualShiftParsingService = $actualShiftParsingService;
        $this->constantsParsingService = $constantsParsingService;
        $this->staffMemberRepository = $staffMemberRepository;
    }

    public function getUpdatedRotaEntity(Request $request) {
        if (!$request->request->has('id')) {
            throw new BadRequestHttpException('Can not update a rota without an id');
        }
        $id = (int) $request->request->get('id');
        $rota = $this->rotaRepository->getById($id);
        if (is_null($rota)) {
            throw new BadRequestHttpException("Rota with id ${$id} does not exist");
        }

        $rota->setDate(new DateTime($request->request->get('date')));
        $rota->setForecastRevenue((float) $request->request->get('forecastRevenue'));
        $rota->setTargetLabourRate((float) $request->request->get('targetLabourRate'));
        $rota->setStatus($request->request->get('status'));

        $constants = $request->request->get('constants');
        if (array_key_exists('id', $constants)) {
            $rota->setConstants($this->constantsParsingService->getUpdatedConstantsEntity($constants));
        } else {
            throw new BadRequestHttpException('Can not create a new constants entity when creating a rota');
        }

        $plannedShifts = $rota->getPlannedShifts();
        foreach ($plannedShifts->toArray() as $plannedShift) { /** @var PlannedShift $plannedShift */
            $exists = false;
            foreach ($request->request->get('plannedShifts') as $requestedShift) {
                if (array_key_exists('id', $requestedShift) && $plannedShift->getId() === $requestedShift['id']) {
                    $exists = true;
                }
            }
            if (!$exists) {
                $rota->removePlannedShift($plannedShift);
            }
        }
        foreach($request->request->get('plannedShifts') as $plannedShift) { /** @var array $plannedShift */
            if (array_key_exists('id', $plannedShift)) {
                $id = $plannedShift['id'];
                $plannedShifts = $rota->getPlannedShifts()->filter(function (PlannedShift $plannedShift) use ($id) { return $plannedShift->getId() === $id; });
                if (count($plannedShifts) === 0) {
                    throw new BadRequestHttpException("Planned shift with id ${$id} must exist to update it");
                }

                $this->plannedShiftParsingService->getUpdatedPlannedShiftEntity($plannedShift, $plannedShifts->first());
            } else {
                $rota->addPlannedShift($this->plannedShiftParsingService->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
            }
        }

        $actualShifts = $rota->getActualShifts();
        foreach ($actualShifts->toArray() as $actualShift) { /** @var ActualShift $actualShift */
            $exists = false;
            foreach ($request->request->get('actualShifts') as $requestedShift) {
                if (array_key_exists('id', $requestedShift) && $actualShift->getId() === $requestedShift['id']) {
                    $exists = true;
                }
            }
            if (!$exists) {
                $rota->removeActualShift($actualShift);
            }
        }
        foreach($request->request->get('actualShifts') as $actualShift) { /** @var array $actualShift */
            if (array_key_exists('id', $actualShift)) {
                $id = $actualShift['id'];
                $actualShifts = $rota->getActualShifts()->filter(function (ActualShift $actualShift) use ($id) { return $actualShift->getId() === $id; });
                if (count($actualShifts) === 0) {
                    throw new BadRequestHttpException("Actual shift with id ${$id} must exist to update it");
                }
                $this->actualShiftParsingService->getUpdatedActualShiftEntity($actualShift, $actualShifts->first());
            } else {
                $rota->addActualShift($this->actualShiftParsingService->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
            }
        }

        return $rota;
    }

    public function getNewRotaEntity(Request $request) {
        $rota = new Rota();
        $rota->setDate(new DateTime($request->request->get('date')));
        $rota->setForecastRevenue((float) $request->request->get('forecastRevenue'));
        $rota->setTargetLabourRate((float) $request->request->get('targetLabourRate'));
        $rota->setStatus($request->request->get('status'));

        $constants = $request->request->get('constants');
        if (array_key_exists('id', $constants)) {
            $rota->setConstants($this->constantsParsingService->getUpdatedConstantsEntity($constants));
        } else {
            throw new BadRequestHttpException('Can not create a new constants entity when creating a rota');
        }

        foreach($request->request->get('plannedShifts') as $plannedShift) {
            if (array_key_exists('id', $plannedShift)) {
                throw new BadRequestHttpException('Can not re-use an existing planned shift entity when creating a new rota');
            } else {
                $rota->addPlannedShift($this->plannedShiftParsingService->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
            }
        }

        foreach($request->request->get('actualShifts') as $actualShift) {
            if (array_key_exists('id', $actualShift)) {
                throw new BadRequestHttpException('Can not re-use an existing actual shift entity when creating a new rota');
            } else {
                $rota->addActualShift($this->actualShiftParsingService->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
            }
        }

        return $rota;
    }
}