<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ConstantsRepository")
 */
class Constants {
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
    private $fixed_costs;

    /**
     * @ORM\Column(type="float")
     */
    private $labour_rate;

    /**
     * @ORM\Column(type="float")
     */
    private $vat_multiplier;

    /**
     * @ORM\Column(type="float")
     */
    private $bar_proportion_of_revenue;

    /**
     * @ORM\Column(type="float")
     */
    private $hours_per_short_break;

    /**
     * @ORM\Column(type="float")
     */
    private $short_break_duration;

    /**
     * @ORM\Column(type="float")
     */
    private $hours_per_long_break;

    /**
     * @ORM\Column(type="float")
     */
    private $long_break_duration;

    /**
     * @ORM\Column(type="float")
     */
    private $kitchen_hours_per_short_break;

    /**
     * @ORM\Column(type="float")
     */
    private $kitchen_short_break_duration;

    /**
     * @ORM\Column(type="float")
     */
    private $kitchen_hours_per_long_break;

    /**
     * @ORM\Column(type="float")
     */
    private $kitchen_long_break_duration;

    /**
     * @ORM\Column(type="float")
     */
    private $ers_threshold;

    /**
     * @ORM\Column(type="float")
     */
    private $ers_percent_above_threshold;

    /**
     * @ORM\Column(type="float")
     */
    private $holiday_linear_percent;

    /**
     * @ORM\Column(type="float")
     */
    private $pension_linear_percent;

    public function getId(): ?int {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self {
        $this->date = $date;
        return $this;
    }

    public function getFixedCosts(): ?float {
        return $this->fixed_costs;
    }

    public function setFixedCosts(float $fixed_costs): self {
        $this->fixed_costs = $fixed_costs;
        return $this;
    }

    public function getLabourRate(): ?float {
        return $this->labour_rate;
    }

    public function setLabourRate(float $labour_rate): self {
        $this->labour_rate = $labour_rate;
        return $this;
    }

    public function getVatMultiplier(): ?float {
        return $this->vat_multiplier;
    }

    public function setVatMultiplier(float $vat_multiplier): self {
        $this->vat_multiplier = $vat_multiplier;
        return $this;
    }

    public function getBarProportionOfRevenue(): ?float {
        return $this->bar_proportion_of_revenue;
    }

    public function setBarProportionOfRevenue(float $bar_proportion_of_revenue): self {
        $this->bar_proportion_of_revenue = $bar_proportion_of_revenue;
        return $this;
    }

    public function getHoursPerShortBreak(): ?float {
        return $this->hours_per_short_break;
    }

    public function setHoursPerShortBreak(float $hours_per_short_break): self {
        $this->hours_per_short_break = $hours_per_short_break;
        return $this;
    }

    public function getShortBreakDuration(): ?float {
        return $this->short_break_duration;
    }

    public function setShortBreakDuration(float $short_break_duration): self {
        $this->short_break_duration = $short_break_duration;
        return $this;
    }

    public function getHoursPerLongBreak(): ?float {
        return $this->hours_per_long_break;
    }

    public function setHoursPerLongBreak(float $hours_per_long_break): self {
        $this->hours_per_long_break = $hours_per_long_break;
        return $this;
    }

    public function getLongBreakDuration(): ?float {
        return $this->long_break_duration;
    }

    public function setLongBreakDuration(float $long_break_duration): self {
        $this->long_break_duration = $long_break_duration;
        return $this;
    }

    public function getKitchenHoursPerShortBreak(): ?float {
        return $this->kitchen_hours_per_short_break;
    }

    public function setKitchenHoursPerShortBreak(float $hours_per_short_break): self {
        $this->kitchen_hours_per_short_break = $hours_per_short_break;
        return $this;
    }

    public function getKitchenShortBreakDuration(): ?float {
        return $this->kitchen_short_break_duration;
    }

    public function setKitchenShortBreakDuration(float $short_break_duration): self {
        $this->kitchen_short_break_duration = $short_break_duration;
        return $this;
    }

    public function getKitchenHoursPerLongBreak(): ?float {
        return $this->kitchen_hours_per_long_break;
    }

    public function setKitchenHoursPerLongBreak(float $hours_per_long_break): self {
        $this->kitchen_hours_per_long_break = $hours_per_long_break;
        return $this;
    }

    public function getKitchenLongBreakDuration(): ?float {
        return $this->kitchen_long_break_duration;
    }

    public function setKitchenLongBreakDuration(float $long_break_duration): self {
        $this->kitchen_long_break_duration = $long_break_duration;
        return $this;
    }

    public function getErsThreshold(): ?float {
        return $this->ers_threshold;
    }

    public function setErsThreshold(float $ers_threshold): self {
        $this->ers_threshold = $ers_threshold;
        return $this;
    }

    public function getErsPercentAboveThreshold(): ?float {
        return $this->ers_percent_above_threshold;
    }

    public function setErsPercentAboveThreshold(float $ers_percent_above_threshold): self {
        $this->ers_percent_above_threshold = $ers_percent_above_threshold;
        return $this;
    }

    public function getHolidayLinearPercent(): ?float {
        return $this->holiday_linear_percent;
    }

    public function setHolidayLinearPercent(float $holiday_linear_percent): self {
        $this->holiday_linear_percent = $holiday_linear_percent;
        return $this;
    }

    public function getPensionLinearPercent(): ?float {
        return $this->pension_linear_percent;
    }

    public function setPensionLinearPercent(float $pension_linear_percent): self {
        $this->pension_linear_percent = $pension_linear_percent;
        return $this;
    }

    public function serialise() {
        return (object)[
            'id' => $this->getId(),
            'date' => $this->getDate()->format('Y-m-d'),
            'fixedCosts' => $this->getFixedCosts(),
            'labourRate' => $this->getLabourRate(),
            'vatMultiplier' => $this->getVatMultiplier(),
            'barProportionOfRevenue' => $this->getBarProportionOfRevenue(),
            'hoursPerShortBreak' => $this->getHoursPerShortBreak(),
            'shortBreakDuration' => $this->getShortBreakDuration(),
            'hoursPerLongBreak' => $this->getHoursPerLongBreak(),
            'longBreakDuration' => $this->getLongBreakDuration(),
            'kitchenHoursPerShortBreak' => $this->getKitchenHoursPerShortBreak(),
            'kitchenShortBreakDuration' => $this->getKitchenShortBreakDuration(),
            'kitchenHoursPerLongBreak' => $this->getKitchenHoursPerLongBreak(),
            'kitchenLongBreakDuration' => $this->getKitchenLongBreakDuration(),
            'ersThreshold' => $this->getErsThreshold(),
            'ersPercentAboveThreshold' => $this->getErsPercentAboveThreshold(),
            'holidayLinearPercent' => $this->getHolidayLinearPercent(),
            'pensionLinearPercent' => $this->getPensionLinearPercent(),
        ];
    }
}
