<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StaffRoleRepository")
 */
class StaffRole
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
     * @ORM\Column(type="integer")
     */
    private $order_in_rota;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\StaffMember", mappedBy="staff_role")
     */
    private $staffMembers;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    public function __construct()
    {
        $this->staffMembers = new ArrayCollection();
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
        $this->role = $role;

        return $this;
    }

    public function getOrderInRota(): ?int
    {
        return $this->order_in_rota;
    }

    public function setOrderInRota(int $order_in_rota): self
    {
        $this->order_in_rota = $order_in_rota;

        return $this;
    }

    /**
     * @return Collection|StaffMember[]
     */
    public function getStaffMembers(): Collection
    {
        return $this->staffMembers;
    }

    public function addStaffMember(StaffMember $staffMember): self
    {
        if (!$this->staffMembers->contains($staffMember)) {
            $this->staffMembers[] = $staffMember;
            $staffMember->setStaffRole($this);
        }

        return $this;
    }

    public function removeStaffMember(StaffMember $staffMember): self
    {
        if ($this->staffMembers->contains($staffMember)) {
            $this->staffMembers->removeElement($staffMember);
            // set the owning side to null (unless already changed)
            if ($staffMember->getStaffRole() === $this) {
                $staffMember->setStaffRole(null);
            }
        }

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function serialise() {
        return (object) [
            'id' => $this->getId(),
            'role' => $this->getRole(),
            'orderInRota' => $this->getOrderInRota(),
            'status' => $this->getStatus(),
            'type' => $this->getType(),
        ];
    }
}
