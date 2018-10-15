<?php

namespace App\Controller;

use App\Entity\Role;
use App\Entity\User;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use App\Service\UserPersistenceService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UserController {

    public function userAction(Request $request, UserRepository $userRepository, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $users = $userRepository->findAll();
                return new JsonResponse(array_map(function (User $user) {return $user->serialiseAll();}, $users)); //TODO: should get current user
            case 'POST':
                $missingRequestFields = [];
                if (!$request->request->has('email')) {
                    $missingRequestFields[] = 'email';
                }
                if (!$request->request->has('whitelisted')) {
                    $missingRequestFields[] = 'whitelisted';
                }
                if (!$request->request->has('blacklisted')) {
                    $missingRequestFields[] = 'blacklisted';
                }
                if (!$request->request->has('role')) {
                    $missingRequestFields[] = 'role';
                }
                if (count($missingRequestFields) > 0) {
                    throw new BadRequestHttpException("Must include fields ".join(", ",$missingRequestFields)." in body");
                }
                $user = new User();
                $user->setEmail($request->request->get('email'));
                $user->setWhitelisted($request->request->get('whitelisted'));
                $user->setBlacklisted($request->request->get('blacklisted'));
                $role = $roleRepository->findOneBy(['role' => $request->request->get('role')]); // qq - criteria
                $user->setRole($role);
                $userPersistenceService->persistUser($user);
                return new JsonResponse($user);
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function roleAction(Request $request, RoleRepository $roleRepository, UserPersistenceService $userPersistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $roles = $roleRepository->findAll();
                return new JsonResponse(array_map(function(Role $role) {return $role->serialiseAll();}, $roles)); //TODO: should get current role
            case 'POST':
                $missingRequestFields = [];
                if (!$request->request->has('role')) {
                    $missingRequestFields[] = 'role';
                }
                if (!$request->request->has('managesUsers')) {
                    $missingRequestFields[] = 'managesUsers';
                }
                if (count($missingRequestFields) > 0) {
                    throw new BadRequestHttpException("Must include fields ".join(", ",$missingRequestFields)." in body");
                }
                $role = new Role();
                $role->setRole($request->request->get('role'));
                $role->setManagesUsers($request->request->get('managesUsers'));
                $userPersistenceService->persistRole($role);
                return new JsonResponse($role);
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
            throw new BadRequestHttpException("Method not allowed");
        }
    }
}