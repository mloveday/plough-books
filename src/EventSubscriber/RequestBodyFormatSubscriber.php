<?php
namespace App\EventSubscriber;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class RequestBodyFormatSubscriber implements EventSubscriberInterface
{
    /** List of paths that do _not_ require checking the request body is provided in JSON */
    const NO_CHECK_ENDPOINTS = ["/"];

    public function onKernelController(FilterControllerEvent $event)
    {
        $request = $event->getRequest();
        if ($request->getMethod() === "GET") {
            return;
        }

        if (in_array($request->getPathInfo(), self::NO_CHECK_ENDPOINTS) || stripos($event->getRequest()->getPathInfo(), '/_profiler') === 0) {
            return;
        }

        if (0 !== strpos(strtolower($request->getContentType()), 'json')) {
            throw new BadRequestHttpException("Request body must be JSON, content type sent is (".$request->getContentType().")");
        }

        $request->request->replace(json_decode($request->getContent(), true));
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::CONTROLLER => 'onKernelController',
        );
    }
}