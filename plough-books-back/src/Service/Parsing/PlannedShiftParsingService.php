<?php

namespace App\Service\Parsing;

use App\Entity\PlannedShift;
use App\Entity\StaffMember;
use App\Entity\StaffRole;
use App\Repository\PlannedShiftRepository;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PlannedShiftParsingService {

    /** @var PlannedShiftRepository */
    private $plannedShiftRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var StaffRoleRepository */
    private $staffRoleRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(PlannedShiftRepository $plannedShiftRepository, StaffMemberRepository $staffMemberRepository, StaffRoleRepository $staffRoleRepository, RequestValidator $requestValidator) {
        $this->plannedShiftRepository = $plannedShiftRepository;
        $this->staffMemberRepository = $staffMemberRepository;
        $this->staffRoleRepository = $staffRoleRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, ['staffMember', 'staffRole', 'status', 'hourlyRate', 'startTime', 'endTime', 'totalBreaks', 'type']);
    }

    public function getUpdatedPlannedShiftEntity(array $plannedShift, PlannedShift $entity) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMember = $this->getStaffMember($plannedShift);
        $staffRole = $this->getStaffRole($plannedShift);
        return $this->updatePlannedShiftEntity($plannedShift, $entity, $staffMember, $staffRole);
    }

    public function getNewPlannedShiftEntity(int $rotaId, array $plannedShift) {
        if (!array_key_exists('id', $plannedShift['staffMember'])) {
            throw new BadRequestHttpException('Planned shift staff member must have an id');
        }
        $staffMemberId = (int) $plannedShift['staffMember']['id'];
        $staffMember = $this->getStaffMember($plannedShift);
        $staffRole = $this->getStaffRole($plannedShift);
        if ($rotaId !== RotaParsingService::NEW_ROTA_ID && !is_null($this->plannedShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Planned shift for staff member with id ${staffMemberId} already exists");
        }
        return $this->updatePlannedShiftEntity($plannedShift, new PlannedShift(), $staffMember, $staffRole);
    }

    private function updatePlannedShiftEntity(array $plannedShift, PlannedShift $entity, StaffMember $staffMember, StaffRole $staffRole): PlannedShift {
        return $entity
            ->setStaffMember($staffMember)
            ->setStaffRole($staffRole)
            ->setStartTime(new DateTime($plannedShift['startTime']))
            ->setEndTime(new DateTime($plannedShift['endTime']))
            ->setTotalBreaks((float)$plannedShift['totalBreaks'])
            ->setHourlyRate((float)$plannedShift['hourlyRate'])
            ->setType($plannedShift['type'])
            ;
    }

    private function getStaffMember(array $shift) {
        $staffMemberId = (int)$shift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Planned shift staff member with id ${$staffMemberId} does not exist");
        }
        return $staffMember;
    }

    private function getStaffRole(array $shift) {
        $roleId = (int)$shift['staffRole']['id'];
        $role = $this->staffRoleRepository->getById($roleId);
        if (is_null($role)) {
            throw new BadRequestHttpException("Planned shift staff role with id ${$roleId} does not exist");
        }
        return $role;
    }
}