<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\HolidayRepository")
 */
class Holiday {
    const API_ID = 'id';
    const API_START_DATE = 'startDate';
    const API_END_DATE = 'endDate';
    const API_STAFF_ID = 'staffId';

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $startDate;

    /**
     * @ORM\Column(type="date")
     */
    private $endDate;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\StaffMember", inversedBy="holidays")
     * @ORM\JoinColumn(nullable=false)
     */
    private $staffMember;

    public function getId(): ?int {
        return $this->id;
    }

    public function getStartDate(): ?\DateTimeInterface {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): self {
        $this->startDate = $startDate;
        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self {
        $this->endDate = $endDate;
        return $this;
    }

    public function getStaffMember(): ?StaffMember {
        return $this->staffMember;
    }

    public function setStaffMember(?StaffMember $staffMember): self {
        $this->staffMember = $staffMember;
        return $this;
    }

    public function serialise() {
        return (object) [
            self::API_ID => $this->getId(),
            self::API_START_DATE => $this->getStartDate()->format('Y-m-d'),
            self::API_END_DATE => $this->getEndDate()->format('Y-m-d'),
            self::API_STAFF_ID => $this->getStaffMember()->getId(),
        ];
    }
}
