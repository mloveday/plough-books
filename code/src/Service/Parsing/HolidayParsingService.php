<?php

namespace App\Service\Parsing;

use App\Entity\Holiday;
use App\Repository\HolidayRepository;
use App\Repository\StaffMemberRepository;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class HolidayParsingService {

    /** @var HolidayRepository */
    private $holidayRepository;
    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(HolidayRepository $holidayRepository, StaffMemberRepository $staffMemberRepository, RequestValidator $requestValidator) {
        $this->holidayRepository = $holidayRepository;
        $this->staffMemberRepository = $staffMemberRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [
            Holiday::API_START_DATE,
            Holiday::API_END_DATE,
            Holiday::API_STAFF_ID,
        ]);
    }

    public function getNewHolidayEntity(array $holiday) {
        if (array_key_exists(Holiday::API_ID, $holiday)) {
            throw new BadRequestHttpException("New Holiday entity in request should not have an id");
        }
        return $this->updateHolidayEntity($holiday, new Holiday());
    }

    public function getUpdatedHolidayEntity(array $holiday) {
        if (!array_key_exists(holiday::API_ID, $holiday)) {
            throw new BadRequestHttpException("Existing Holiday entity in request has no id");
        }
        $entity = $this->holidayRepository->findOneBy(['id' => $holiday[holiday::API_ID]]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("Holiday with id ${$holiday[holiday::API_ID]} does not exist");
        }
        return $this->updateHolidayEntity($holiday, $entity);
    }

    private function updateHolidayEntity(array $holiday, Holiday $entity) {
        $staffMember = $this->staffMemberRepository->findOneBy(['id' => $holiday[Holiday::API_STAFF_ID]]);
        if (is_null($staffMember)) {
            throw new BadRequestHttpException('staff member for holiday does not exist');
        }
        return $entity
            ->setStartDate(new DateTime($holiday[Holiday::API_START_DATE]))
            ->setEndDate(new DateTime($holiday[Holiday::API_END_DATE]))
            ->setStaffMember($staffMember);
    }
}