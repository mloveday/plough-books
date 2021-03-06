<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User
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
    private $email;

    /**
     * @ORM\Column(type="boolean")
     */
    private $whitelisted;

    /**
     * @ORM\Column(type="boolean")
     */
    private $blacklisted;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Role", inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     */
    private $role;

    private $placeholder = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower($email);

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

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getUsername()
    {
        return $this->getEmail();
    }

    public function getRoles()
    {
        return [$this->getRole()];
    }

    public function getPassword() {}
    public function getSalt() {}
    public function eraseCredentials() {}

    public function serialiseAll() {
        return (object) [
            "id" => $this->getId(),
            "email" => $this->getEmail(),
            "role" => $this->getRole()->serialiseAll(),
            "whitelisted" => $this->getWhitelisted(),
            "blacklisted" => $this->getBlacklisted(),
        ];
    }

    public function serialiseMinimal() {
        return (object) [
            "email" => $this->getEmail()
        ];
    }

    /**
     * @return bool
     */
    public function isPlaceholder(): bool
    {
        return $this->placeholder;
    }

    /**
     * @param bool $placeholder
     * @return User
     */
    public function setPlaceholder(bool $placeholder): User
    {
        $this->placeholder = $placeholder;
        return $this;
    }
}
