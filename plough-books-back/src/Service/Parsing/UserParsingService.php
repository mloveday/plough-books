<?php

namespace App\Service\Parsing;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\UserRoleRepository;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserParsingService {

    /** @var UserRepository */
    private $userRepository;
    /** @var UserRoleRepository */
    private $roleRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(UserRepository $userRepository, UserRoleRepository $roleRepository, RequestValidator $requestValidator) {
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, ['email', 'whitelisted', 'blacklisted', 'role']);
    }

    public function getUpdatedUserEntity(Request $request): User {
        $user = $this->userRepository->getById($request->request->getInt('id'));
        if ($user->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID does not exist");
        }
        $role = $this->roleRepository->getById((int)$request->request->get('role')['id']);
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        $user->setEmail($request->request->get('email'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'))
            ->setRole($role);
        return $user;
    }

    public function getNewUserEntity(Request $request): User {
        $existingUser = $this->userRepository->getByEmail($request->request->get('email'));
        if (!$existingUser->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID already exists (id={$existingUser->getId()})");
        }
        $role = $this->roleRepository->getById((int)$request->request->get('role')['id']);
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        $user = new User();
        $user->setEmail($request->request->get('email'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'))
            ->setRole($role);
        return $user;
    }

    public function getUserEntityForDeletion(Request $request): User {
        $user = $this->userRepository->getById($request->request->getInt('id'));
        if ($user->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID does not exist");
        }
        return $user;
    }
}