<?php

namespace App\Controller;

use App\Entity\Domain;
use App\Repository\DomainRepository;
use App\Service\Parsing\DomainParsingService;
use App\Service\PersistenceService;
use App\Service\UserLoginVerificationService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class DomainController {

    public function domainAction(Request $request, RequestValidator $requestValidator, UserLoginVerificationService $userLoginVerificationService, DomainParsingService $domainParsingService, PersistenceService $persistenceService) {
        $authenticatedUser = $userLoginVerificationService->getAuthenticatedUserFromToken($request->query->get('token'));
        if (!$authenticatedUser->getRole()->getManagesUsers()) {
            throw new UnauthorizedHttpException("User does not have required permissions");
        }
        switch($request->getMethod()) {
            case 'POST':
                $requestValidator->validateRequestFields($request, ['domain', 'whitelisted', 'blacklisted']);
                if ($request->request->has('id')) {
                    $domain = $domainParsingService->getUpdatedDomainEntity($request);
                } else {
                    $domain = $domainParsingService->getNewDomainEntity($request);
                }
                $persistenceService->persist($domain);
                return new JsonResponse($domain->serialiseAll());
            case 'DELETE':
                $requestValidator->validateRequestFields($request, ['id']);
                $domain = $domainParsingService->getDomainEntityForDeletion($request);
                $persistenceService->delete($domain);
                return new JsonResponse(null);
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
}