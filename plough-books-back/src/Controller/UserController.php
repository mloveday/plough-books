<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\Parsing\UserParsingService;
use App\Service\PersistenceService;
use App\Service\UserLoginVerificationService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserController {

    public function userAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, UserParsingService $userParsingService, PersistenceService $persistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if ($request->getMethod() === 'GET') {
            return new JsonResponse($authenticatedUser->serialiseAll());
        }
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'POST':
                $userParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $user = $userParsingService->getUpdatedUserEntity($request);
                } else {
                    $user = $userParsingService->getNewUserEntity($request);
                }
                $persistenceService->persist($user);
                return new JsonResponse($user->serialiseAll());
            case 'DELETE':
                $requestValidator->validateRequestFields($request->request->all(), ['id']);
                $user = $userParsingService->getUserEntityForDeletion($request);
                $persistenceService->delete($user);
                return new JsonResponse(null);
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
}