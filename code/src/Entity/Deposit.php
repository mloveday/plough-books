<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DepositRepository")
 */
class Deposit
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
    private $description;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\CashUp", inversedBy="receipts")
     */
    private $cashUp;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getCashUp(): ?CashUp
    {
        return $this->cashUp;
    }

    public function setCashUp(?CashUp $cashUp): self
    {
        $this->cashUp = $cashUp;

        return $this;
    }

    public function serialise() {
        return (object) [
            'id' => $this->getId(),
            'description' => $this->getDescription(),
            'amount' => $this->getAmount(),
        ];
    }
}
