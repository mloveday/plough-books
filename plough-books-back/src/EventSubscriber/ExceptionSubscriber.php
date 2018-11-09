<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public function onKernelException(GetResponseForExceptionEvent $event){
        if (HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType()) {
            return;
        }
        $response = new JsonResponse();
        $request = $event->getRequest();
        $exception = $event->getException();
        $response->headers->set('Access-Control-Allow-Origin', $request->headers->get('Origin'));
        if ($exception instanceof HttpException) {
            $response->setStatusCode($exception->getStatusCode());
            $response->setContent(json_encode((object)["message" => $exception->getMessage()]));
        } else {
            if ($_ENV['APP_ENV'] === 'dev') {
                $response->setContent(json_encode((object)["message" => $exception->getMessage(), "trace" => $exception->getTrace()]));
            } else {
                $response->setContent(json_encode((object) ['message' => 'Internal server error']));
            }
            $response->setStatusCode(500);
        }
        $response->send();
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::EXCEPTION => 'onKernelException',
        );
    }
}