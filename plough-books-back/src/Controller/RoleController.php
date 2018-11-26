<?php

namespace App\Controller;

use App\Entity\Role;
use App\Repository\RoleRepository;
use App\Service\RoleParsingService;
use App\Service\UserLoginVerificationService;
use App\Service\UserPersistenceService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class RoleController {

    public function roleAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, RoleParsingService $roleParsingService, UserPersistenceService $userPersistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'POST':
                $requestValidator->validateRequestFields($request, ['role', 'managesUsers']);
                if ($request->request->has('id')) {
                    $role = $roleParsingService->getUpdatedRoleEntity($request);
                } else {
                    $role = $roleParsingService->getNewRoleEntity($request);
                }
                $userPersistenceService->persistRole($role);
                return new JsonResponse($role->serialiseAll());
            case 'DELETE':
                $requestValidator->validateRequestFields($request, ['id']);
                $role = $roleParsingService->getRoleEntityForDeletion($request);
                $userPersistenceService->deleteRole($role);
                return new JsonResponse(null);
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
}