<?php

namespace App\Controller;

use App\Entity\Domain;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\DomainRepository;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use App\Service\UserPersistenceService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserController {

    public function userAction(Request $request, RequestValidator $requestValidator, UserRepository $userRepository, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $users = $userRepository->findAll();
                return new JsonResponse(array_map(function (User $user) {return $user->serialiseAll();}, $users)); //TODO: should get current user
            case 'POST':
                $requestValidator->validateRequestFields($request, ['email', 'whitelisted', 'blacklisted', 'role']);
                if ($request->request->has('id')) {
                    $user = $this->getUpdatedUserEntity($request, $userRepository, $roleRepository);
                } else {
                    $user = $this->getNewUserEntity($request, $userRepository, $roleRepository);
                }
                $userPersistenceService->persistUser($user);
                return new JsonResponse($user->serialiseAll());
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function roleAction(Request $request, RequestValidator $requestValidator, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $roles = $roleRepository->findAll();
                return new JsonResponse(array_map(function(Role $role) {return $role->serialiseAll();}, $roles)); //TODO: should get current role
            case 'POST':
                $requestValidator->validateRequestFields($request, ['role', 'managesUsers']);
                if ($request->request->has('id')) {
                    $role = $this->getUpdatedRoleEntity($request, $roleRepository);
                } else {
                    $role = $this->getNewRoleEntity($request, $roleRepository);
                }
                $userPersistenceService->persistRole($role);
                return new JsonResponse($role->serialiseAll());
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function domainAction(Request $request, RequestValidator $requestValidator, DomainRepository $domainRepository, UserPersistenceService $userPersistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $domains = $domainRepository->findAll();
                return new JsonResponse(array_map(function(Domain $domain) {return $domain->serialiseAll();}, $domains)); //TODO: should get current domain
            case 'POST':
                $requestValidator->validateRequestFields($request, ['domain', 'whitelisted', 'blacklisted']);
                if ($request->request->has('id')) {
                    $domain = $this->getUpdatedDomainEntity($request, $domainRepository);
                } else {
                    $domain = $this->getNewDomainEntity($request, $domainRepository);
                }
                $userPersistenceService->persistDomain($domain);
                return new JsonResponse($domain->serialiseAll());
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    private function getUpdatedUserEntity(Request $request, UserRepository $userRepository, RoleRepository $roleRepository): User
    {
        $user = $userRepository->getById($request->request->getInt('id'));
        if ($user->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID does not exist");
        }
        $role = $roleRepository->getById($request->request->getInt('role'));
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        $user->setEmail($request->request->get('email'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'))
            ->setRole($role);
        return $user;
    }

    private function getNewUserEntity(Request $request, UserRepository $userRepository, RoleRepository $roleRepository): User
    {
        $existingUser = $userRepository->getByEmail($request->request->get('email'));
        if (!$existingUser->isPlaceholder()) {
            throw new BadRequestHttpException("User with given ID already exists (id={$existingUser->getId()})");
        }
        $role = $roleRepository->getById($request->request->getInt('role'));
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

    private function getUpdatedRoleEntity(Request $request, RoleRepository $roleRepository)
    {
        $role = $roleRepository->getById($request->request->getInt('id'));
        if ($role->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given ID does not exist");
        }
        $role->setRole($request->request->get('role'))
            ->setManagesUsers($request->request->getBoolean('managesUsers'));
        return $role;
    }

    private function getNewRoleEntity(Request $request, RoleRepository $roleRepository): Role
    {
        $existingRole = $roleRepository->getByRole($request->request->get('role'));
        if (!$existingRole->isPlaceholder()) {
            throw new BadRequestHttpException("Role with given name already exists (id={$existingRole->getId()})");
        }
        $role = new Role();
        $role->setRole($request->request->get('role'))
            ->setManagesUsers($request->request->getBoolean('managesUsers'));
        return $role;
    }

    private function getUpdatedDomainEntity(Request $request, DomainRepository $domainRepository): Domain
    {
        $domain = $domainRepository->getById($request->request->get('id'));
        if ($domain->isPlaceholder()) {
            throw new BadRequestHttpException("Domain with given ID does not exist");
        }
        $domain->setDomain($request->request->get('domain'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'));
        return $domain;
    }

    private function getNewDomainEntity(Request $request, DomainRepository $domainRepository): Domain
    {
        $existingDomain = $domainRepository->getByDomain($request->request->get('domain'));
        if (!$existingDomain->isPlaceholder()) {
            throw new BadRequestHttpException("Domain already exists (id={$existingDomain->getId()})");
        }
        $domain = new Domain();
        $domain->setDomain($request->request->get('domain'))
            ->setWhitelisted($request->request->getBoolean('whitelisted'))
            ->setBlacklisted($request->request->getBoolean('blacklisted'));
        return $domain;
    }
}