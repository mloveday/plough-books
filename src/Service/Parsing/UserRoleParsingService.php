<?php

namespace App\Service\Parsing;

use App\Entity\Role;
use App\Repository\UserRoleRepository;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserRoleParsingService {

    /** @var UserRoleRepository */
    private $roleRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(UserRoleRepository $roleRepository, RequestValidator $requestValidator) {
        $this->roleRepository = $roleRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, ['role', 'managesUsers']);
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