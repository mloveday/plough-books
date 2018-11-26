<?php

namespace App\Service\Parsing;

use App\Entity\User;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserParsingService {

    /** @var UserRepository */
    private $userRepository;
    /** @var RoleRepository */
    private $roleRepository;

    public function __construct(UserRepository $userRepository, RoleRepository $roleRepository) {
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
    }

    public function getUpdatedUserEntity(Request $request): User {
        $user = $this->userRepository->getById($request->request->getInt('id'));
        if ($user->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID does not exist");
        }
        $role = $this->roleRepository->getById($request->request->getInt('role'));
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
        $role = $this->roleRepository->getById($request->request->getInt('role'));
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