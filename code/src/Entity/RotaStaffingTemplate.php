<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RotaStaffingTemplateRepository")
 */
class RotaStaffingTemplate {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;
    /**
     * @ORM\Column(type="json")
     */
    private $staff_levels;
    /**
     * @ORM\Column(type="integer")
     */
    private $revenue;
    /**
     * @ORM\Column(type="string", length=255, columnDefinition="enum('bar', 'kitchen', 'ancillary')")
     */
    private $work_type;
    /**
     * @ORM\Column(type="integer")
     */
    private $day_of_week;

    public function getId(): ?int {
        return $this->id;
    }

    public function getStaffLevels() {
        return $this->staff_levels;
    }

    public function setStaffLevels($staff_levels): self {
        $this->staff_levels = $staff_levels;
        return $this;
    }

    public function getRevenue(): ?int {
        return $this->revenue;
    }

    public function setRevenue(int $revenue): self {
        $this->revenue = $revenue;
        return $this;
    }

    public function getWorkType(): ?string {
        return $this->work_type;
    }

    public function setWorkType(string $work_type): self {
        $this->work_type = $work_type;
        return $this;
    }

    public function getDayOfWeek(): ?int {
        return $this->day_of_week;
    }

    public function setDayOfWeek(int $day_of_week): self {
        $this->day_of_week = $day_of_week;
        return $this;
    }
}
