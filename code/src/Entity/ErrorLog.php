<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ErrorLogRepository")
 */
class ErrorLog {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $timestamp;

    /**
     * @ORM\Column(type="text")
     */
    private $message;

    /**
     * @ORM\Column(type="text")
     */
    private $trace;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $code;

    public function getId(): ?int {
        return $this->id;
    }

    public function getTimestamp(): ?\DateTimeInterface {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeInterface $timestamp): self {
        $this->timestamp = $timestamp;
        return $this;
    }

    public function getMessage(): ?string {
        return $this->message;
    }

    public function setMessage(string $message): self {
        $this->message = $message;
        return $this;
    }

    public function getTrace(): ?string {
        return $this->trace;
    }

    public function setTrace(string $trace): self {
        $this->trace = $trace;
        return $this;
    }

    public function getCode(): ?string {
        return $this->code;
    }

    public function setCode(string $code): self {
        $this->code = $code;
        return $this;
    }
}
