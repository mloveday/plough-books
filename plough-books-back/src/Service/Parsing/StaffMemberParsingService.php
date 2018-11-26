<?php

namespace App\Service\Parsing;

use App\Entity\StaffMember;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaffMemberParsingService {

    /** @var StaffMemberRepository */
    private $staffMemberRepository;
    /** @var StaffRoleRepository */
    private $staffRoleRepository;

    public function __construct(StaffMemberRepository $staffMemberRepository, StaffRoleRepository $staffRoleRepository) {
        $this->staffMemberRepository = $staffMemberRepository;
        $this->staffRoleRepository = $staffRoleRepository;
    }

    public function getNewStaffMemberEntity(array $staffMember) {
        if (array_key_exists('id', $staffMember)) {
            throw new BadRequestHttpException("New StaffMember entity in request should not have an id");
        }
        return $this->updateStaffMemberEntity($staffMember, new StaffMember());
    }

    public function getUpdatedStaffMemberEntity(array $staffMember) {
        if (!array_key_exists('id', $staffMember)) {
            throw new BadRequestHttpException("Existing StaffMember entity in request has no id");
        }
        $entity = $this->staffMemberRepository->findOneBy(['id' => $staffMember['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("StaffMember with id ${$staffMember['id']} does not exist");
        }
        return $this->updateStaffMemberEntity($staffMember, $entity);
    }

    private function updateStaffMemberEntity(array $staffMember, StaffMember $entity) {
        $role = $this->staffRoleRepository->findOneBy(['id' => $staffMember['role']['id']]);
        if (is_null($role)) {
            throw new BadRequestHttpException('role for staff member does not exist');
        }
        return $entity->setName($staffMember['name'])
            ->setStatus($staffMember['status'])
            ->setCurrentHourlyRate((float) $staffMember['currentHourlyRate'])
            ->setStaffRole($role)
            ;
    }
}