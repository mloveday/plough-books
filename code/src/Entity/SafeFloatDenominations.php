<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ReceiptRepository")
 */
class SafeFloatDenominations {

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $fiftyPounds;

    /**
     * @ORM\Column(type="float")
     */
    private $twentyPounds;

    /**
     * @ORM\Column(type="float")
     */
    private $tenPounds;

    /**
     * @ORM\Column(type="float")
     */
    private $fivePounds;

    /**
     * @ORM\Column(type="float")
     */
    private $pounds;

    /**
     * @ORM\Column(type="float")
     */
    private $fiftyPence;

    /**
     * @ORM\Column(type="float")
     */
    private $twentyPence;

    /**
     * @ORM\Column(type="float")
     */
    private $tenPence;

    /**
     * @ORM\Column(type="float")
     */
    private $fivePence;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $initials;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId($id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getFiftyPounds(): ?float
    {
        return $this->fiftyPounds;
    }

    public function setFiftyPounds($fiftyPounds): self
    {
        $this->fiftyPounds = $fiftyPounds;
        return $this;
    }

    public function getTwentyPounds(): ?float
    {
        return $this->twentyPounds;
    }

    public function setTwentyPounds($twentyPounds): self
    {
        $this->twentyPounds = $twentyPounds;
        return $this;
    }

    public function getTenPounds(): ?float
    {
        return $this->tenPounds;
    }

    public function setTenPounds($tenPounds): self
    {
        $this->tenPounds = $tenPounds;
        return $this;
    }

    public function getFivePounds(): ?float
    {
        return $this->fivePounds;
    }

    public function setFivePounds($fivePounds): self
    {
        $this->fivePounds = $fivePounds;
        return $this;
    }

    public function getPounds(): ?float
    {
        return $this->pounds;
    }

    public function setPounds($pounds): self
    {
        $this->pounds = $pounds;
        return $this;
    }

    public function getFiftyPence(): ?float
    {
        return $this->fiftyPence;
    }

    public function setFiftyPence($fiftyPence): self
    {
        $this->fiftyPence = $fiftyPence;
        return $this;
    }

    public function getTwentyPence(): ?float
    {
        return $this->twentyPence;
    }

    public function setTwentyPence($twentyPence): self
    {
        $this->twentyPence = $twentyPence;
        return $this;
    }

    public function getTenPence(): ?float
    {
        return $this->tenPence;
    }

    public function setTenPence($tenPence): self
    {
        $this->tenPence = $tenPence;
        return $this;
    }

    public function getFivePence(): ?float
    {
        return $this->fivePence;
    }

    public function setFivePence($fivePence): self
    {
        $this->fivePence = $fivePence;
        return $this;
    }

    public function getInitials(): ?string
    {
        return $this->initials;
    }

    public function setInitials($initials): self
    {
        $this->initials = $initials;
        return $this;
    }

    public function serialise() {
        return (object) [
            'id' => $this->id,
            'fiftyPounds' => $this->fiftyPounds,
            'twentyPounds' => $this->twentyPounds,
            'tenPounds' => $this->tenPounds,
            'fivePounds' => $this->fivePounds,
            'pounds' => $this->pounds,
            'fiftyPence' => $this->fiftyPence,
            'twentyPence' => $this->twentyPence,
            'tenPence' => $this->tenPence,
            'fivePence' => $this->fivePence,
            'float_amnt' => $this->initials,
        ];
    }

}