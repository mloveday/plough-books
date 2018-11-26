<?php

namespace App\Service;

use App\Entity\PlannedShift;
use App\Entity\StaffMember;
use App\Repository\PlannedShiftRepository;
use App\Repository\StaffMemberRepository;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PlannedShiftParsingService {

    /** @var PlannedShiftRepository */
    private $plannedShiftRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;

    public function __construct(PlannedShiftRepository $plannedShiftRepository, StaffMemberRepository $staffMemberRepository) {
        $this->plannedShiftRepository = $plannedShiftRepository;
        $this->staffMemberRepository = $staffMemberRepository;
    }

    public function getUpdatedPlannedShiftEntity(array $plannedShift, PlannedShift $entity) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMemberId = (int) $plannedShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Planned shift staff member with id ${$staffMemberId} does not exist");
        }
        return $this->updatePlannedShiftEntity($plannedShift, $entity, $staffMember);
    }

    public function getNewPlannedShiftEntity(int $rotaId, array $plannedShift) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMemberId = (int) $plannedShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Planned shift staff member with id ${$staffMemberId} does not exist");
        }
        if ($rotaId !== RotaParsingService::NEW_ROTA_ID && !is_null($this->plannedShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Planned shift for staff member with id ${staffMemberId} already exists");
        }
        return $this->updatePlannedShiftEntity($plannedShift, new PlannedShift(), $staffMember);
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
}