<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="UserRoleRepository")
 */
class Role
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
    private $role;

    /**
     * @ORM\Column(type="boolean")
     */
    private $manages_users;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="role")
     */
    private $users;

    private $placeholder = false;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = strtolower($role);

        return $this;
    }

    public function getManagesUsers(): ?bool
    {
        return $this->manages_users;
    }

    public function setManagesUsers(bool $manages_users): self
    {
        $this->manages_users = $manages_users;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setRole($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getRole() === $this) {
                $user->setRole(null);
            }
        }

        return $this;
    }

    public function serialiseAll() {
        return (object) [
            "id" => $this->getId(),
            "role" => $this->getRole(),
            "managesUsers" => $this->getManagesUsers()
        ];
    }

    public function serialiseMinimal() {
        return (object) [
            "role" => $this->getRole()
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
     * @return Role
     */
    public function setPlaceholder(bool $placeholder): Role
    {
        $this->placeholder = $placeholder;
        return $this;
    }
}
