<?php
namespace App\EventSubscriber;

use App\Service\UserLoginVerificationService;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Service\AccessControlService;

class GoogleTokenSubscriber implements EventSubscriberInterface
{
    /** List of paths that do _not_ require authentication. All others require authentication */
    const NO_AUTH_ENDPOINTS = ["/"];

    private $accessControlService;
    private $userLoginVerificationService;

    public function __construct(AccessControlService $accessControlService, UserLoginVerificationService $userLoginVerificationService) {
        $this->accessControlService = $accessControlService;
        $this->userLoginVerificationService = $userLoginVerificationService;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        if (in_array($event->getRequest()->getPathInfo(), self::NO_AUTH_ENDPOINTS) || stripos($event->getRequest()->getPathInfo(), '/_profiler') === 0) {
            return;
        }
        $token = $event->getRequest()->query->get('token');
        if (is_null($token)) {
            throw new UnauthorizedHttpException('','token is required for authentication');
        }

        $payload = $this->userLoginVerificationService->getUserPayload($token);

        if (!$this->accessControlService->isAllowedAccess($payload['email'])) {
            throw new UnauthorizedHttpException('','email address not permitted');
        }

        $this->verifyEndpointSpecificCredentials($event, $payload);
    }

    private function verifyEndpointSpecificCredentials(FilterControllerEvent $event, $payload)
    {
        if (stripos($event->getRequest()->getPathInfo(), '/user-management') === 0) {
            if (!$this->accessControlService->canManageUsers($payload['email'])) {
                throw new UnauthorizedHttpException('', "user does not have permission to access {$event->getRequest()->getPathInfo()}");
            }
        }
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::CONTROLLER => 'onKernelController',
        );
    }
}