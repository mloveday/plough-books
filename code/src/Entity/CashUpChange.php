<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CashUpChangeRepository")
 */
class CashUpChange {
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $initials;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $witness;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CashUp", inversedBy="change")
     */
    private $cashUp;

    public function getId(): ?int {
        return $this->id;
    }

    public function getInitials(): ?string {
        return $this->initials;
    }

    public function setInitials(string $initials): self {
        $this->initials = $initials;
        return $this;
    }

    public function getWitness(): ?string {
        return $this->witness;
    }

    public function setWitness(string $witness): self {
        $this->witness = $witness;
        return $this;
    }

    public function getAmount(): ?float {
        return $this->amount;
    }

    public function setAmount(float $amount): self {
        $this->amount = $amount;
        return $this;
    }

    public function getCashUp(): ?CashUp {
        return $this->cashUp;
    }

    public function setCashUp(?CashUp $cashUp): self {
        $this->cashUp = $cashUp;
        return $this;
    }

    public function serialise() {
        return (object) [
            'id' => $this->getId(),
            'initials' => $this->getInitials(),
            'witness' => $this->getWitness(),
            'amount' => $this->getAmount(),
        ];
    }
}
