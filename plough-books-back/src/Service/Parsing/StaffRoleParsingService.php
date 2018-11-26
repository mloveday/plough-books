<?php

namespace App\Service\Parsing;

use App\Entity\StaffRole;
use App\Repository\StaffRoleRepository;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaffRoleParsingService {

    /** @var StaffRoleRepository */
    private $staffRoleRepository;

    public function __construct(StaffRoleRepository $staffRoleRepository) {
        $this->staffRoleRepository = $staffRoleRepository;
    }

    public function getNewStaffRoleEntity(array $staffRole) {
        if (array_key_exists('id', $staffRole)) {
            throw new BadRequestHttpException("New StaffRole entity in request should not have an id");
        }
        return $this->updateStaffRoleEntity($staffRole, new StaffRole());
    }

    public function getUpdatedStaffRoleEntity(array $staffRole) {
        if (!array_key_exists('id', $staffRole)) {
            throw new BadRequestHttpException("Existing StaffRole entity in request has no id");
        }
        $entity = $this->staffRoleRepository->findOneBy(['id' => $staffRole['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("StaffRole with id ${$staffRole['id']} does not exist");
        }
        return $this->updateStaffRoleEntity($staffRole, $entity);
    }

    private function updateStaffRoleEntity(array $staffRole, StaffRole $entity) {
        return $entity->setRole($staffRole['role'])
            ->setStatus($staffRole['status'])
            ->setType('type')
            ->setOrderInRota('orderInRota')
            ;
    }
}