<?php

namespace App\Entity;

use App\Service\Parsing\RotaParsingService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RotaRepository")
 */
class Rota
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="float")
     */
    private $forecast_revenue;

    /**
     * @ORM\Column(type="float")
     */
    private $target_labour_rate;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Constants", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $constants;

    /**
     * @ORM\Column(type="string", length=255, columnDefinition="enum('imported', 'new', 'draft', 'rota_complete', 'sign_in_complete')")
     */
    private $status;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlannedShift", mappedBy="rota", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $plannedShifts;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ActualShift", mappedBy="rota", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $actualShifts;

    public function __construct()
    {
        $this->plannedShifts = new ArrayCollection();
        $this->actualShifts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getForecastRevenue(): ?float
    {
        return $this->forecast_revenue;
    }

    public function setForecastRevenue(float $forecast_revenue): self
    {
        $this->forecast_revenue = $forecast_revenue;

        return $this;
    }

    public function getTargetLabourRate(): ?float
    {
        return $this->target_labour_rate;
    }

    public function setTargetLabourRate(float $target_labour_rate): self
    {
        $this->target_labour_rate = $target_labour_rate;

        return $this;
    }

    public function getConstants(): ?Constants
    {
        return $this->constants;
    }

    public function setConstants(?Constants $constants): self
    {
        $this->constants = $constants;

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
            $plannedShift->setRota($this);
        }

        return $this;
    }

    public function removePlannedShift(PlannedShift $plannedShift): self
    {
        if ($this->plannedShifts->contains($plannedShift)) {
            $this->plannedShifts->removeElement($plannedShift);
            // set the owning side to null (unless already changed)
            if ($plannedShift->getRota() === $this) {
                $plannedShift->setRota(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ActualShift[]
     */
    public function getActualShifts(): Collection
    {
        return $this->actualShifts;
    }

    public function addActualShift(ActualShift $actualShift): self
    {
        if (!$this->actualShifts->contains($actualShift)) {
            $this->actualShifts[] = $actualShift;
            $actualShift->setRota($this);
        }

        return $this;
    }

    public function removeActualShift(ActualShift $actualShift): self
    {
        if ($this->actualShifts->contains($actualShift)) {
            $this->actualShifts->removeElement($actualShift);
            // set the owning side to null (unless already changed)
            if ($actualShift->getRota() === $this) {
                $actualShift->setRota(null);
            }
        }

        return $this;
    }

    public function serialise() {
        return (object) [
            RotaParsingService::PARAM__ID => $this->getId(),
            RotaParsingService::PARAM__DATE => $this->getDate()->format('Y-m-d'),
            RotaParsingService::PARAM__FORECAST_REVENUE => $this->getForecastRevenue(),
            RotaParsingService::PARAM__TARGET_LABOUR_RATE => $this->getTargetLabourRate(),
            RotaParsingService::PARAM__CONSTANTS => $this->getConstants()->serialise(),
            RotaParsingService::PARAM__STATUS => $this->getStatus(),
            RotaParsingService::PARAM__PLANNED_SHIFTS => array_map(function(PlannedShift $plannedShift) { return $plannedShift->serialise();}, $this->getPlannedShifts()->toArray()),
            RotaParsingService::PARAM__ACTUAL_SHIFTS => array_map(function(ActualShift $actualShift) { return $actualShift->serialise();}, $this->getActualShifts()->toArray()),
        ];
    }
}
