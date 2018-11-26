<?php

namespace App\Service\Parsing;

use App\Entity\ActualShift;
use App\Entity\StaffMember;
use App\Repository\ActualShiftRepository;
use App\Repository\StaffMemberRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ActualShiftParsingService {

    /** @var ActualShiftRepository */
    private $actualShiftRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(ActualShiftRepository $actualShiftRepository, StaffMemberRepository $staffMemberRepository, RequestValidator $requestValidator) {
        $this->actualShiftRepository = $actualShiftRepository;
        $this->staffMemberRepository = $staffMemberRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, ['staffMember', 'status', 'hourlyRate', 'startTime', 'endTime', 'totalBreaks', 'type']);
    }

    public function getUpdatedActualShiftEntity(array $actualShift, ActualShift $entity) {
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

    public function getNewActualShiftEntity(int $rotaId, array $actualShift) {
        if (!array_key_exists('id', $actualShift['staffMember'])) {
            throw new BadRequestHttpException('Actual shift staff member must have an id');
        }
        $staffMemberId = (int) $actualShift['staffMember']['id'];
        $staffMember = $this->staffMemberRepository->getById($staffMemberId);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException("Actual shift staff member with id ${$staffMemberId} does not exist");
        }
        if ($rotaId !== RotaParsingService::NEW_ROTA_ID && !is_null($this->actualShiftRepository->findByRotaIdAndStaffMemberId($rotaId, $staffMemberId))) {
            throw new BadRequestHttpException("Actual shift for staff member with id ${staffMemberId} already exists");
        }
        return $this->updateActualShiftEntity($actualShift, new ActualShift(), $staffMember);
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