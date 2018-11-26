<?php

namespace App\Controller;

use App\Entity\Role;
use App\Repository\UserRoleRepository;
use App\Service\Parsing\UserRoleParsingService;
use App\Service\PersistenceService;
use App\Service\UserLoginVerificationService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserRoleController {

    public function roleAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, UserRoleParsingService $roleParsingService, PersistenceService $persistenceService) {
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
                $persistenceService->persist($role);
                return new JsonResponse($role->serialiseAll());
            case 'DELETE':
                $requestValidator->validateRequestFields($request, ['id']);
                $role = $roleParsingService->getRoleEntityForDeletion($request);
                $persistenceService->delete($role);
                return new JsonResponse(null);
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function rolesAction(Request $request, UserLoginVerificationService $userLoginVerificationService, UserRoleRepository $roleRepository) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        $roles = $roleRepository->findAll();
        return new JsonResponse(array_map(function (Role $role) { return $role->serialiseAll(); }, $roles));
    }
}