<?php

namespace App\Service\Parsing;

use App\Entity\ActualShift;
use App\Entity\StaffMember;
use App\Entity\StaffRole;
use App\Repository\ActualShiftRepository;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ActualShiftParsingService {

    /** @var ActualShiftRepository */
    private $actualShiftRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var StaffRoleRepository */
    private $staffRoleRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(ActualShiftRepository $actualShiftRepository, StaffMemberRepository $staffMemberRepository, StaffRoleRepository $staffRoleRepository, RequestValidator $requestValidator) {
        $this->actualShiftRepository = $actualShiftRepository;
        $this->staffMemberRepository = $staffMemberRepository;
        $this->staffRoleRepository = $staffRoleRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, ['staffMember', 'staffRole', 'status', 'hourlyRate', 'startTime', 'endTime', 'totalBreaks', 'type']);
    }

    public function getUpdatedActualShiftEntity(array $actualShift, ActualShift $entity) {
        if (!array_key_exists('id', $actualShift['staffMember'])) {
            throw new BadRequestHttpException('Actual shift staff member must have an id');
        }
        $staffMember = $this->getStaffMember($actualShift);
        $staffRole = $this->getStaffRole($actualShift);
        return $this->updateActualShiftEntity($actualShift, $entity, $staffMember, $staffRole);
    }

    public function getNewActualShiftEntity(int $rotaId, array $actualShift) {
        if (!array_key_exists('id', $actualShift['staffMember'])) {
            throw new BadRequestHttpException('Actual shift staff member must have an id');
        }
        $staffMemberId = (int) $actualShift['staffMember']['id'];
        $staffMember = $this->getStaffMember($actualShift);
        $staffRole = $this->getStaffRole($actualShift);
        if ($rotaId !== RotaParsingService::NEW_ROTA_ID && !is_null($this->actualShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Actual shift for staff member with id ${staffMemberId} already exists");
        }
        return $this->updateActualShiftEntity($actualShift, new ActualShift(), $staffMember, $staffRole);
    }

    private function updateActualShiftEntity(array $actualShift, ActualShift $entity, StaffMember $staffMember, StaffRole $staffRole): ActualShift {
        return $entity
            ->setStaffMember($staffMember)
            ->setStaffRole($staffRole)
            ->setStartTime(new DateTime($actualShift['startTime']))
            ->setEndTime(new DateTime($actualShift['endTime']))
            ->setTotalBreaks((float)$actualShift['totalBreaks'])
            ->setHourlyRate((float)$actualShift['hourlyRate'])
            ->setType($actualShift['type'])
            ;
    }

    private function getStaffMember(array $actualShift) {
        $staffMemberId = (int)$actualShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Actual shift staff member with id ${$staffMemberId} does not exist");
        }
        return $staffMember;
    }

    private function getStaffRole(array $actualShift) {
        $roleId = (int)$actualShift['staffRole']['id'];
        $role = $this->staffRoleRepository->getById($roleId);
        if (is_null($role)) {
            throw new BadRequestHttpException("Actual shift staff role with id ${$roleId} does not exist");
        }
        return $role;
    }
}