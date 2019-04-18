<?php

namespace App\Controller;

use App\Entity\Domain;
use App\Repository\UserDomainRepository;
use App\Service\Parsing\UserDomainParsingService;
use App\Service\PersistenceService;
use App\Service\UserLoginVerificationService;
use App\Util\RequestAuthorization;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserDomainController {

    public function domainAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, UserDomainParsingService $userDomainParsingService, PersistenceService $persistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken(RequestAuthorization::getToken($request));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'POST':
                $userDomainParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $domain = $userDomainParsingService->getUpdatedDomainEntity($request);
                } else {
                    $domain = $userDomainParsingService->getNewDomainEntity($request);
                }
                $persistenceService->persist($domain);
                return new JsonResponse($domain->serialiseAll());
            case 'DELETE':
                $requestValidator->validateRequestFields($request->request->all(), ['id']);
                $domain = $userDomainParsingService->getDomainEntityForDeletion($request);
                $persistenceService->delete($domain);
                return new JsonResponse(null);
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function domainsAction(Request $request, UserLoginVerificationService $userLoginVerificationService, UserDomainRepository $domainRepository) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken(RequestAuthorization::getToken($request));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        $domains = $domainRepository->findAll();
        return new JsonResponse(array_map(function (Domain $domain) { return $domain->serialiseAll(); }, $domains));
    }
}