<?php

namespace App\Service;

use App\Entity\Role;
use App\Repository\RoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RoleParsingService {

    /** @var RoleRepository */
    private $roleRepository;

    public function __construct(RoleRepository $roleRepository) {
        $this->roleRepository = $roleRepository;
    }

    public function getUpdatedRoleEntity(Request $request)
    {
        $role = $this->roleRepository->getById($request->request->getInt('id'));
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        $role->setRole($request->request->get('role'))
            ->setManagesUsers($request->request->getBoolean('managesUsers'));
        return $role;
    }

    public function getNewRoleEntity(Request $request): Role
    {
        $existingRole = $this->roleRepository->getByRole($request->request->get('role'));
        if (!$existingRole->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given name already exists (id={$existingRole->getId()})");
        }
        $role = new Role();
        $role->setRole($request->request->get('role'))
            ->setManagesUsers($request->request->getBoolean('managesUsers'));
        return $role;
    }

    public function getRoleEntityForDeletion(Request $request)
    {
        $role = $this->roleRepository->getById($request->request->getInt('id'));
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        return $role;
    }
}