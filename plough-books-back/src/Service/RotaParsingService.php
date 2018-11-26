<?php

namespace App\Service;

use App\Entity\ActualShift;
use App\Entity\Constants;
use App\Entity\PlannedShift;
use App\Entity\Rota;
use App\Entity\StaffMember;
use App\Repository\ActualShiftRepository;
use App\Repository\ConstantsRepository;
use App\Repository\PlannedShiftRepository;
use App\Repository\RotaRepository;
use App\Repository\StaffMemberRepository;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaParsingService {

    const NEW_ROTA_ID = -1;
    /** @var RotaRepository */
    private $rotaRepository;
    /** @var PlannedShiftRepository */
    private $plannedShiftRepository;
    /** @var ActualShiftRepository */
    private $actualShiftRepository;
    /** @var ConstantsRepository */
    private $constantsRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;

    /**
     * RotaParsingService constructor.
     * @param RotaRepository $rotaRepository
     * @param PlannedShiftRepository $plannedShiftRepository
     * @param ActualShiftRepository $actualShiftRepository
     * @param ConstantsRepository $constantsRepository
     * @param StaffMemberRepository $staffMemberRepository
     */
    public function __construct(RotaRepository $rotaRepository, PlannedShiftRepository $plannedShiftRepository, ActualShiftRepository $actualShiftRepository, ConstantsRepository $constantsRepository, StaffMemberRepository $staffMemberRepository) {
        $this->rotaRepository = $rotaRepository;
        $this->plannedShiftRepository = $plannedShiftRepository;
        $this->actualShiftRepository = $actualShiftRepository;
        $this->constantsRepository = $constantsRepository;
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
            $rota->setConstants($this->getUpdatedConstantsEntity($constants));
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

                $this->getUpdatedPlannedShiftEntity($plannedShift, $plannedShifts->first());
            } else {
                $rota->addPlannedShift($this->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
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
                $this->getUpdatedActualShiftEntity($actualShift, $actualShifts->first());
            } else {
                $rota->addActualShift($this->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
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
            $rota->setConstants($this->getUpdatedConstantsEntity($constants));
        } else {
            throw new BadRequestHttpException('Can not create a new constants entity when creating a rota');
        }

        foreach($request->request->get('plannedShifts') as $plannedShift) {
            if (array_key_exists('id', $plannedShift)) {
                throw new BadRequestHttpException('Can not re-use an existing planned shift entity when creating a new rota');
            } else {
                $rota->addPlannedShift($this->getNewPlannedShiftEntity(self::NEW_ROTA_ID, $plannedShift));
            }
        }

        foreach($request->request->get('actualShifts') as $actualShift) {
            if (array_key_exists('id', $actualShift)) {
                throw new BadRequestHttpException('Can not re-use an existing actual shift entity when creating a new rota');
            } else {
                $rota->addActualShift($this->getNewActualShiftEntity(self::NEW_ROTA_ID, $actualShift));
            }
        }

        return $rota;
    }

    private function getUpdatedConstantsEntity(array $constants) {
        if (!array_key_exists('id', $constants)) {
            throw new BadRequestHttpException("Constants request has no id");
        }
        $entity = $this->constantsRepository->findOneBy(['id' => $constants['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("Constants with id ${$constants['id']} does not exist");
        }
        return $this->updateConstantsEntity($constants, $entity);
    }

    private function getUpdatedPlannedShiftEntity(array $plannedShift, PlannedShift $entity) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMemberId = (int) $plannedShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Planned shift staff member with id ${$staffMemberId} does not exist");
        }
        $this->updatePlannedShiftEntity($plannedShift, $entity, $staffMember);
        return $entity;

    }

    private function getNewPlannedShiftEntity(int $rotaId, array $plannedShift) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMemberId = (int) $plannedShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Planned shift staff member with id ${$staffMemberId} does not exist");
        }
        if ($rotaId !== self::NEW_ROTA_ID && !is_null($this->plannedShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Planned shift for staff member with id ${staffMemberId} already exists");
        }
        $entity = new PlannedShift();
        $this->updatePlannedShiftEntity($plannedShift, $entity, $staffMember);
        return $entity;
    }

    private function getUpdatedActualShiftEntity(array $actualShift, ActualShift $entity) {
        if (!array_key_exists('id', $actualShift['staffMember'])) {
            throw new BadRequestHttpException('Actual shift staff member must have an id');
        }
        $staffMemberId = (int) $actualShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Actual shift staff member with id ${$staffMemberId} does not exist");
        }
        return $this->updateActualShiftEntity($actualShift, $entity, $staffMember);
    }

    private function getNewActualShiftEntity(int $rotaId, array $actualShift) {
        if (!array_key_exists('id', $actualShift['staffMember'])) {
            throw new BadRequestHttpException('Actual shift staff member must have an id');
        }
        $staffMemberId = (int) $actualShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Actual shift staff member with id ${$staffMemberId} does not exist");
        }
        if ($rotaId !== self::NEW_ROTA_ID && !is_null($this->actualShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Actual shift for staff member with id ${staffMemberId} already exists");
        }
        return $this->updateActualShiftEntity($actualShift, new ActualShift(), $staffMember);
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

    private function updatePlannedShiftEntity(array $plannedShift, PlannedShift $entity, StaffMember $staffMember): PlannedShift {
        return $entity
            ->setStaffMember($staffMember)
            ->setStartTime(new DateTime($plannedShift['startTime']))
            ->setEndTime(new DateTime($plannedShift['endTime']))
            ->setTotalBreaks((float)$plannedShift['totalBreaks'])
            ->setHourlyRate((float)$plannedShift['hourlyRate'])
            ->setType($plannedShift['type'])
            ;
    }

    private function updateActualShiftEntity(array $actualShift, ActualShift $entity, StaffMember $staffMember): ActualShift {
        return $entity
            ->setStaffMember($staffMember)
            ->setStartTime(new DateTime($actualShift['startTime']))
            ->setEndTime(new DateTime($actualShift['endTime']))
            ->setTotalBreaks((float)$actualShift['totalBreaks'])
            ->setHourlyRate((float)$actualShift['hourlyRate'])
            ->setType($actualShift['type'])
            ;
    }
}