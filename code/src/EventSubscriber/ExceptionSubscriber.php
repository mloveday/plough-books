<?php

namespace App\EventSubscriber;

use App\Entity\ErrorLog;
use App\Service\PersistenceService;
use DateTime;
use Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Twig\Environment;

class ExceptionSubscriber implements EventSubscriberInterface
{
    /** @var PersistenceService */
    private $persistenceService;
    /** @var Environment */
    private $twig;
    /** @var \Swift_Mailer */
    private $mailer;

    public function __construct(PersistenceService $persistenceService, Environment $twig, \Swift_Mailer $mailer) {
        $this->persistenceService = $persistenceService;
        $this->twig = $twig;
        $this->mailer = $mailer;
    }

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
            $code = uniqid('', true);

            try {
                $log = new ErrorLog();
                $log->setCode($code)
                    ->setMessage($exception->getMessage())
                    ->setTrace($exception->getTraceAsString())
                    ->setTimestamp(new DateTime());
                $this->persistenceService->persist($log);
            } catch (Exception $e) {
                // continue - more important to show user the appropriate message
            }

            try {
                // send email
                $body = $this->twig->render(
                    'errorhandling/errorbody.txt.twig',
                    ['time' => (new DateTime())->format(DateTime::ISO8601), 'code' => $code, 'message' => $exception->getMessage(), 'trace' => $exception->getTraceAsString()]
                );
                $message = (new \Swift_Message('Plough 500: '.$exception->getMessage()))
                    ->setBody($body)
                    ->setTo('miles@theploughharborne.co.uk')
                    ->setFrom('miles@theploughharborne.co.uk');
                $this->mailer->send($message);
            } catch (Exception $e) {
                // continue
            }

//            if ($_ENV['APP_ENV'] === 'dev') {
                $response->setContent(json_encode((object)["message" => $exception->getMessage(), "trace" => $exception->getTrace(), "code" => $code]));
//            } else {
//                $response->setContent(json_encode((object) ['message' => 'Internal server error', "code" => $code]));
//            }
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