<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlannedShiftRepository")
 */
class PlannedShift
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $hourly_rate;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\StaffMember", inversedBy="plannedShifts")
     */
    private $staff_member;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\StaffRole", inversedBy="actualShifts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $staff_role;

    /**
     * @ORM\Column(type="datetime")
     */
    private $start_time;

    /**
     * @ORM\Column(type="datetime")
     */
    private $end_time;

    /**
     * @ORM\Column(type="float")
     */
    private $total_breaks;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Rota", inversedBy="plannedShifts")
     */
    private $rota;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHourlyRate(): ?float
    {
        return $this->hourly_rate;
    }

    public function setHourlyRate(float $hourly_rate): self
    {
        $this->hourly_rate = $hourly_rate;

        return $this;
    }

    public function getStaffMember(): ?StaffMember
    {
        return $this->staff_member;
    }

    public function setStaffMember(?StaffMember $staff_member): self
    {
        $this->staff_member = $staff_member;

        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->start_time;
    }

    public function setStartTime(\DateTimeInterface $start_time): self
    {
        $this->start_time = $start_time;

        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->end_time;
    }

    public function setEndTime(\DateTimeInterface $end_time): self
    {
        $this->end_time = $end_time;

        return $this;
    }

    public function getTotalBreaks(): ?float
    {
        return $this->total_breaks;
    }

    public function setTotalBreaks(float $total_breaks): self
    {
        $this->total_breaks = $total_breaks;

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

    public function getRota(): ?Rota
    {
        return $this->rota;
    }

    public function setRota(?Rota $rota): self
    {
        $this->rota = $rota;

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

    public function serialise() {
        return (object) [
            'id' => $this->getId(),
            'staffMember' => $this->getStaffMember()->serialise(),
            'staffRole' => $this->getStaffRole()->serialise(),
            'hourlyRate' => $this->getHourlyRate(),
            'startTime' => $this->getStartTime()->format('Y-m-d H:i'),
            'endTime' => $this->getEndTime()->format('Y-m-d H:i'),
            'totalBreaks' => $this->getTotalBreaks(),
            'type' => $this->getType(),
        ];
    }
}
