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
                $role = $roleRepository->findOneBy(['role' => $request->request->get('role')]); // TODO change to using ID
                $user = new User();
                $user->setEmail($request->request->get('email'))
                    ->setWhitelisted($request->request->getBoolean('whitelisted'))
                    ->setBlacklisted($request->request->getBoolean('blacklisted'))
                    ->setRole($role);
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
                $role = new Role();
                $role->setRole($request->request->get('role'))
                    ->setManagesUsers($request->request->getBoolean('managesUsers'));
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
                    // update
                    $domain = $domainRepository->getById($request->request->get('id'));
                    if ($domain->isDomainPlaceholder()) {
                        throw new BadRequestHttpException("Domain with given ID does not exist");
                    }
                    $domain->setDomain($request->request->get('domain'))
                        ->setWhitelisted($request->request->getBoolean('whitelisted'))
                        ->setBlacklisted($request->request->getBoolean('blacklisted'));
                    $userPersistenceService->persistDomain($domain);
                } else {
                    // create
                    $domain = new Domain();
                    $domain->setDomain($request->request->get('domain'))
                        ->setWhitelisted($request->request->getBoolean('whitelisted'))
                        ->setBlacklisted($request->request->getBoolean('blacklisted'));
                    $userPersistenceService->persistDomain($domain);
                }
                return new JsonResponse($domain->serialiseAll());
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}