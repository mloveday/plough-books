<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="UserDomainRepository")
 */
class Domain
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $domain;

    /**
     * @ORM\Column(type="boolean")
     */
    private $whitelisted;

    /**
     * @ORM\Column(type="boolean")
     */
    private $blacklisted;

    private $placeholder = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDomain(): ?string
    {
        return $this->domain;
    }

    public function setDomain(string $domain): self
    {
        $this->domain = strtolower($domain);

        return $this;
    }

    public function getWhitelisted(): ?bool
    {
        return $this->whitelisted;
    }

    public function setWhitelisted(bool $whitelisted): self
    {
        $this->whitelisted = $whitelisted;

        return $this;
    }

    public function getBlacklisted(): ?bool
    {
        return $this->blacklisted;
    }

    public function setBlacklisted(bool $blacklisted): self
    {
        $this->blacklisted = $blacklisted;

        return $this;
    }

    public function serialiseAll()
    {
        return (object) [
            "id" => $this->getId(),
            "domain" => $this->getDomain(),
            "whitelisted" => $this->getWhitelisted(),
            "blacklisted" => $this->getBlacklisted(),
        ];
    }

    public function serialiseMinimal()
    {
        return (object) [
            "domain" => $this->getDomain(),
        ];
    }

    public function isPlaceholder(): bool
    {
        return $this->placeholder;
    }

    public function setPlaceholder(bool $placeholder): Domain
    {
        $this->placeholder = $placeholder;
        return $this;
    }
}
