<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CashUpRepository")
 */
class CashUp
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $manager_on_duty;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $daily_notes;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TillDenominations", mappedBy="cashUp", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $tills;

    /**
     * @ORM\Column(type="float")
     */
    private $charge_to_account;

    /**
     * @ORM\Column(type="float")
     */
    private $deposit_redeemed;

    /**
     * @ORM\Column(type="float")
     */
    private $comps_wet;

    /**
     * @ORM\Column(type="float")
     */
    private $discount_staff_dry;

    /**
     * @ORM\Column(type="float")
     */
    private $discount_customers_wet;

    /**
     * @ORM\Column(type="float")
     */
    private $discount_customers_dry;

    /**
     * @ORM\Column(type="float")
     */
    private $discount_customers_coffee;

    /**
     * @ORM\Column(type="float")
     */
    private $fwt_wet;

    /**
     * @ORM\Column(type="float")
     */
    private $como_in_drawer;

    /**
     * @ORM\Column(type="float")
     */
    private $amex_tots;

    /**
     * @ORM\Column(type="float")
     */
    private $visa_mc_tots;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Receipt", mappedBy="cashUp", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $receipts;

    /**
     * @ORM\Column(type="float")
     */
    private $spend_staff_points;

    /**
     * @ORM\Column(type="float")
     */
    private $como_discount_asset;

    /**
     * @ORM\Column(type="float")
     */
    private $take_dry;

    /**
     * @ORM\Column(type="float")
     */
    private $take_coffee;

    /**
     * @ORM\Column(type="float")
     */
    private $take_gift_card;

    /**
     * @ORM\Column(type="float")
     */
    private $take_deposit_paid;

    /**
     * @ORM\Column(type="float")
     */
    private $paid_out_amount;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $paid_out_to;

    /**
     * @ORM\Column(type="float")
     */
    private $banked;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $cash_advantage_bag;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $cash_advantage_bag_seen_by;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\SafeFloatDenominations", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $sfd_morning;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\SafeFloatDenominations", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $sfd_evening;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $sfd_notes;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $pub_secured_by;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $bar_closed_by;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $floor_closed_by;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $next_door_by;

    public function __construct()
    {
        $this->tills = new ArrayCollection();
        $this->receipts = new ArrayCollection();
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

    public function getManagerOnDuty(): ?string
    {
        return $this->manager_on_duty;
    }

    public function setManagerOnDuty(string $manager_on_duty): self
    {
        $this->manager_on_duty = $manager_on_duty;

        return $this;
    }

    public function getDailyNotes(): ?string
    {
        return $this->daily_notes;
    }

    public function setDailyNotes(string $daily_notes): self
    {
        $this->daily_notes = $daily_notes;

        return $this;
    }

    /**
     * @return Collection|TillDenominations[]
     */
    public function getTills(): Collection
    {
        return $this->tills;
    }

    public function addTill(TillDenominations $till): self
    {
        if (!$this->tills->contains($till)) {
            $this->tills[] = $till;
            $till->setCashUp($this);
        }

        return $this;
    }

    public function removeTill(TillDenominations $till): self
    {
        if ($this->tills->contains($till)) {
            $this->tills->removeElement($till);
            // set the owning side to null (unless already changed)
            if ($till->getCashUp() === $this) {
                $till->setCashUp(null);
            }
        }

        return $this;
    }

    public function getChargeToAccount(): ?float
    {
        return $this->charge_to_account;
    }

    public function setChargeToAccount(float $charge_to_account): self
    {
        $this->charge_to_account = $charge_to_account;

        return $this;
    }

    public function getDepositRedeemed(): ?float
    {
        return $this->deposit_redeemed;
    }

    public function setDepositRedeemed(float $deposit_redeemed): self
    {
        $this->deposit_redeemed = $deposit_redeemed;

        return $this;
    }

    public function getCompsWet(): ?float
    {
        return $this->comps_wet;
    }

    public function setCompsWet(float $comps_wet): self
    {
        $this->comps_wet = $comps_wet;

        return $this;
    }

    public function getDiscountStaffDry(): ?float
    {
        return $this->discount_staff_dry;
    }

    public function setDiscountStaffDry(float $discount_staff_dry): self
    {
        $this->discount_staff_dry = $discount_staff_dry;

        return $this;
    }

    public function getDiscountCustomersWet(): ?float
    {
        return $this->discount_customers_wet;
    }

    public function setDiscountCustomersWet(float $discount_customers_wet): self
    {
        $this->discount_customers_wet = $discount_customers_wet;

        return $this;
    }

    public function getDiscountCustomersDry(): ?float
    {
        return $this->discount_customers_dry;
    }

    public function setDiscountCustomersDry(float $discount_customers_dry): self
    {
        $this->discount_customers_dry = $discount_customers_dry;

        return $this;
    }

    public function getDiscountCustomersCoffee(): ?float
    {
        return $this->discount_customers_coffee;
    }

    public function setDiscountCustomersCoffee(float $discount_customers_coffee): self
    {
        $this->discount_customers_coffee = $discount_customers_coffee;

        return $this;
    }

    public function getFwtWet(): ?float
    {
        return $this->fwt_wet;
    }

    public function setFwtWet(float $fwt_wet): self
    {
        $this->fwt_wet = $fwt_wet;

        return $this;
    }

    public function getComoInDrawer(): ?float
    {
        return $this->como_in_drawer;
    }

    public function setComoInDrawer(float $como_in_drawer): self
    {
        $this->como_in_drawer = $como_in_drawer;

        return $this;
    }

    public function getAmexTots(): ?float
    {
        return $this->amex_tots;
    }

    public function setAmexTots(float $amex_tots): self
    {
        $this->amex_tots = $amex_tots;

        return $this;
    }

    public function getVisaMcTots(): ?float
    {
        return $this->visa_mc_tots;
    }

    public function setVisaMcTots(float $visa_mc_tots): self
    {
        $this->visa_mc_tots = $visa_mc_tots;

        return $this;
    }

    /**
     * @return Collection|Receipt[]
     */
    public function getReceipts(): Collection
    {
        return $this->receipts;
    }

    public function addReceipt(Receipt $receipt): self
    {
        if (!$this->receipts->contains($receipt)) {
            $this->receipts[] = $receipt;
            $receipt->setCashUp($this);
        }

        return $this;
    }

    public function removeReceipt(Receipt $receipt): self
    {
        if ($this->receipts->contains($receipt)) {
            $this->receipts->removeElement($receipt);
            // set the owning side to null (unless already changed)
            if ($receipt->getCashUp() === $this) {
                $receipt->setCashUp(null);
            }
        }

        return $this;
    }

    public function getSpendStaffPoints(): ?float
    {
        return $this->spend_staff_points;
    }

    public function setSpendStaffPoints(float $spend_staff_points): self
    {
        $this->spend_staff_points = $spend_staff_points;

        return $this;
    }

    public function getComoDiscountAsset(): ?float
    {
        return $this->como_discount_asset;
    }

    public function setComoDiscountAsset(float $como_discount_asset): self
    {
        $this->como_discount_asset = $como_discount_asset;

        return $this;
    }

    public function getTakeDry(): ?float
    {
        return $this->take_dry;
    }

    public function setTakeDry(float $take_dry): self
    {
        $this->take_dry = $take_dry;

        return $this;
    }

    public function getTakeCoffee(): ?float
    {
        return $this->take_coffee;
    }

    public function setTakeCoffee(float $take_coffee): self
    {
        $this->take_coffee = $take_coffee;

        return $this;
    }

    public function getTakeGiftCard(): ?float
    {
        return $this->take_gift_card;
    }

    public function setTakeGiftCard(float $take_gift_card): self
    {
        $this->take_gift_card = $take_gift_card;

        return $this;
    }

    public function getTakeDepositPaid(): ?float
    {
        return $this->take_deposit_paid;
    }

    public function setTakeDepositPaid(float $take_deposit_paid): self
    {
        $this->take_deposit_paid = $take_deposit_paid;

        return $this;
    }

    public function getPaidOutAmount(): ?float
    {
        return $this->paid_out_amount;
    }

    public function setPaidOutAmount(float $paid_out_amount): self
    {
        $this->paid_out_amount = $paid_out_amount;

        return $this;
    }

    public function getPaidOutTo(): ?string
    {
        return $this->paid_out_to;
    }

    public function setPaidOutTo(string $paid_out_to): self
    {
        $this->paid_out_to = $paid_out_to;

        return $this;
    }

    public function getBanked(): ?float
    {
        return $this->banked;
    }

    public function setBanked(float $banked): self
    {
        $this->banked = $banked;

        return $this;
    }

    public function getCashAdvantageBag(): ?string
    {
        return $this->cash_advantage_bag;
    }

    public function setCashAdvantageBag(string $cash_advantage_bag): self
    {
        $this->cash_advantage_bag = $cash_advantage_bag;

        return $this;
    }

    public function getCashAdvantageBagSeenBy(): ?string
    {
        return $this->cash_advantage_bag_seen_by;
    }

    public function setCashAdvantageBagSeenBy(string $cash_advantage_bag_seen_by): self
    {
        $this->cash_advantage_bag_seen_by = $cash_advantage_bag_seen_by;

        return $this;
    }

    public function getSfdMorning(): ?SafeFloatDenominations
    {
        return $this->sfd_morning;
    }

    public function setSfdMorning(SafeFloatDenominations $sfdMorning): self
    {
        $this->sfd_morning = $sfdMorning;

        return $this;
    }

    public function getSfdEvening(): ?SafeFloatDenominations
    {
        return $this->sfd_evening;
    }

    public function setSfdEvening(?SafeFloatDenominations $sfd_evening): self
    {
        $this->sfd_evening = $sfd_evening;

        return $this;
    }

    public function getSfdNotes(): ?string
    {
        return $this->sfd_notes;
    }

    public function setSfdNotes(string $sfd_notes): self
    {
        $this->sfd_notes = $sfd_notes;

        return $this;
    }

    public function getPubSecuredBy(): ?string
    {
        return $this->pub_secured_by;
    }

    public function setPubSecuredBy(string $pub_secured_by): self
    {
        $this->pub_secured_by = $pub_secured_by;

        return $this;
    }

    public function getBarClosedBy(): ?string
    {
        return $this->bar_closed_by;
    }

    public function setBarClosedBy(string $bar_closed_by): self
    {
        $this->bar_closed_by = $bar_closed_by;

        return $this;
    }

    public function getFloorClosedBy(): ?string
    {
        return $this->floor_closed_by;
    }

    public function setFloorClosedBy(string $floor_closed_by): self
    {
        $this->floor_closed_by = $floor_closed_by;

        return $this;
    }

    public function getNextDoorBy(): ?string
    {
        return $this->next_door_by;
    }

    public function setNextDoorBy(string $next_door_by): self
    {
        $this->next_door_by = $next_door_by;

        return $this;
    }

    public function serialise() {
        return (object) [
            'id' => $this->id,
            'mod' => $this->manager_on_duty,
            'date' => $this->getDate()->format('Y-m-d'),
            'dailyNotes' => $this->daily_notes,
            'tills' => array_values(array_map(function(TillDenominations $till) { return $till->serialise(); } , $this->getTills()->toArray())),
            'chargeToAccount' => $this->charge_to_account,
            'depositRedeemed' => $this->deposit_redeemed,
            'compsWet' => $this->comps_wet,
            'dStaffDry' => $this->discount_staff_dry,
            'dCustomersWet' => $this->discount_customers_wet,
            'dCustomersDry' => $this->discount_customers_dry,
            'dCustomersCoffee' => $this->discount_customers_coffee,
            'fwtWet' => $this->fwt_wet,
            'comoInDrawer' => $this->como_in_drawer,
            'amexTots' => $this->amex_tots,
            'visaMcTots' => $this->visa_mc_tots,
            'receipts' => array_values(array_map(function(Receipt $receipt) { return $receipt->serialise(); }, $this->getReceipts()->toArray())),
            'spendStaffPts' => $this->spend_staff_points,
            'comoDiscAsset' => $this->como_discount_asset,
            'takeDry' => $this->take_dry,
            'takeCoffee' => $this->take_coffee,
            'takeGiftCard' => $this->take_gift_card,
            'takeDepositPaid' => $this->take_deposit_paid,
            'paidOutAmount' => $this->paid_out_amount,
            'paidOutTo' => $this->paid_out_to,
            'banked' => $this->banked,
            'cashAdvantageBag' => $this->cash_advantage_bag,
            'cashAdvantageBagSeenBy' => $this->cash_advantage_bag_seen_by,
            'sfdAm' => $this->getSfdMorning()->serialise(),
            'sfdPm' => $this->getSfdEvening()->serialise(),
            'sfdNotes' => $this->sfd_notes,
            'pubSecuredBy' => $this->pub_secured_by,
            'barClosedBy' => $this->bar_closed_by,
            'floorClosedBy' => $this->floor_closed_by,
            'nextDoorBy' => $this->next_door_by,
        ];
    }
}
