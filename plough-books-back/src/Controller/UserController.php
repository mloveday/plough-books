<?php

namespace App\Controller;

use App\Entity\Domain;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\DomainRepository;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use App\Service\UserLoginVerificationService;
use App\Service\UserPersistenceService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserController {

    public function userAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, UserRepository $userRepository, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        switch($request->getMethod()) {
            case 'GET':
                return new JsonResponse($authenticatedUser->serialiseAll());
            case 'POST':
                if (!$authenticatedUser->getRole()->getManagesUsers()) {
                    throw new UnauthorizedHttpException("User does not have required permissions");
                }
                $requestValidator->validateRequestFields($request, ['email', 'whitelisted', 'blacklisted', 'role']);
                if ($request->request->has('id')) {
                    $user = $this->getUpdatedUserEntity($request, $userRepository, $roleRepository);
                } else {
                    $user = $this->getNewUserEntity($request, $userRepository, $roleRepository);
                }
                $userPersistenceService->persistUser($user);
                return new JsonResponse($user->serialiseAll());
            case 'DELETE':
                if (!$authenticatedUser->getRole()->getManagesUsers()) {
                    throw new UnauthorizedHttpException("User does not have required permissions");
                }
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function usersAction(Request $request, UserLoginVerificationService $userLoginVerificationService, UserRepository $userRepository) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        $users = $userRepository->findAll();
        return new JsonResponse(array_map(function (User $user) { return $user->serialiseAll(); }, $users));
    }

    public function roleAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'GET':
                throw new NotFoundHttpException();
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

    public function rolesAction(Request $request, UserLoginVerificationService $userLoginVerificationService, RoleRepository $roleRepository) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        $roles = $roleRepository->findAll();
        return new JsonResponse(array_map(function (Role $role) { return $role->serialiseAll(); }, $roles));
    }

    public function domainAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, DomainRepository $domainRepository, UserPersistenceService $userPersistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'GET':
                throw new NotFoundHttpException();
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

    public function domainsAction(Request $request, UserLoginVerificationService $userLoginVerificationService, DomainRepository $domainRepository) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        $domains = $domainRepository->findAll();
        return new JsonResponse(array_map(function (Domain $domain) { return $domain->serialiseAll(); }, $domains));
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