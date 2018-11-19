<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\StaffMemberRepository")
 */
class StaffMember
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
    private $name;

    /**
     * @ORM\Column(type="float")
     */
    private $current_hourly_rate;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\StaffRole", inversedBy="staffMembers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $staff_role;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlannedShift", mappedBy="staff_member")
     */
    private $plannedShifts;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    public function __construct()
    {
        $this->plannedShifts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCurrentHourlyRate(): ?float
    {
        return $this->current_hourly_rate;
    }

    public function setCurrentHourlyRate(float $current_hourly_rate): self
    {
        $this->current_hourly_rate = $current_hourly_rate;

        return $this;
    }

    public function getStaffRole(): ?StaffRole
    {
        return $this->staff_role;
    }

    public function setStaffRole(?StaffRole $staff_role): self
    {
        $this->staff_role = $staff_role;

        return $this;
    }

    /**
     * @return Collection|PlannedShift[]
     */
    public function getPlannedShifts(): Collection
    {
        return $this->plannedShifts;
    }

    public function addPlannedShift(PlannedShift $plannedShift): self
    {
        if (!$this->plannedShifts->contains($plannedShift)) {
            $this->plannedShifts[] = $plannedShift;
            $plannedShift->setStaffMember($this);
        }

        return $this;
    }

    public function removePlannedShift(PlannedShift $plannedShift): self
    {
        if ($this->plannedShifts->contains($plannedShift)) {
            $this->plannedShifts->removeElement($plannedShift);
            // set the owning side to null (unless already changed)
            if ($plannedShift->getStaffMember() === $this) {
                $plannedShift->setStaffMember(null);
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

    public function serialise() {
        return (object) [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'currentHourlyRate' => $this->getCurrentHourlyRate(),
            'role' => $this->getStaffRole()->serialise(),
            'status' => $this->getStatus(),
        ];
    }
}
