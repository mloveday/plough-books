<?php

namespace App\Service\Parsing;

use App\Entity\Account;
use App\Entity\CashUp;
use App\Entity\CashUpChange;
use App\Entity\CashUpSkim;
use App\Entity\Deposit;
use App\Entity\Receipt;
use App\Entity\SafeFloatDenominations;
use App\Entity\TillDenominations;
use App\Repository\CashUpRepository;
use App\Util\RequestValidator;
use DateTime;
use DateTimeInterface;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CashUpParsingService {

    /** @var CashUpRepository */
    private $cashUpRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(CashUpRepository $cashUpRepository, RequestValidator $requestValidator) {
        $this->cashUpRepository = $cashUpRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {

    }

    public function getNewCashUpEntity(Request $request) {
        $requestObject = $request->request;
        $date = new DateTime($requestObject->get('date'));
        $existingCashUp = $this->cashUpRepository->getByDate($date);
        if ($existingCashUp !== null) {
            throw new BadRequestHttpException("Cash Up data already exists for this date (".$date->format('Y-m-d').")");
        }

        $cashUpEntity = $this->updateCashUpEntity(new CashUp(), $requestObject, $date);
        foreach ($request->request->get('tills') as $tillRequestArray) {
            $cashUpEntity->addTill($this->updateTillDenominations(new TillDenominations(), $tillRequestArray));
        }
        foreach ($request->request->get('receipts') as $receiptRequestArray) {
            $cashUpEntity->addReceipt($this->updateReceipt(new Receipt(), $receiptRequestArray));
        }
        foreach ($request->request->get('skims') as $skimRequestArray) {
            $cashUpEntity->addSkim($this->updateSkim(new CashUpSkim(), $skimRequestArray));
        }
        foreach ($request->request->get('changes') as $changeRequestArray) {
            $cashUpEntity->addChange($this->updateChange(new CashUpChange(), $changeRequestArray));
        }
        foreach ($request->request->get('deposits') as $depositRequestArray) {
            $cashUpEntity->addDeposit($this->updateDeposit(new Deposit(), $depositRequestArray));
        }
        foreach ($request->request->get('accounts') as $accountRequestArray) {
            $cashUpEntity->addAccount($this->updateAccount(new Account(), $accountRequestArray));
        }
        $cashUpEntity->setSfdMorning($this->updateSafeFloatTillDenominations(new SafeFloatDenominations(), $request->request->get('sfdAm')));
        $cashUpEntity->setSfdEvening($this->updateSafeFloatTillDenominations(new SafeFloatDenominations(), $request->request->get('sfdPm')));
        return $cashUpEntity;
    }

    public function getUpdatedExistingCashUpEntity(Request $request) {
        $requestObject = $request->request;
        $id = $requestObject->get('id');
        $cashUpEntity = $this->cashUpRepository->getById($id);
        if ($cashUpEntity === null) {
            throw new BadRequestHttpException("Cash Up data does not exist for this cash up ID (".$id.")");
        }

        $this->updateCashUpEntity($cashUpEntity, $requestObject, $cashUpEntity->getDate());

        $this->updateSafeFloatTillDenominations($cashUpEntity->getSfdMorning(), $request->get('sfdAm'));
        $this->updateSafeFloatTillDenominations($cashUpEntity->getSfdEvening(), $request->get('sfdPm'));

        foreach ($cashUpEntity->getTills()->toArray() as $existingTill) { /** @var TillDenominations $existingTill */
            $matchingTillsInRequest = array_filter($request->request->get('tills'), function ($till) use ($existingTill) { return array_key_exists('id', $till) && $till['id'] === $existingTill->getId(); });
            if (sizeof($matchingTillsInRequest) === 0) {
                $cashUpEntity->removeTill($existingTill);
            }
        }
        foreach ($request->request->get('tills') as $tillRequestArray) {
            if (array_key_exists('id', $tillRequestArray)) {
                $this->updateTillDenominations($this->findTill($cashUpEntity->getTills()->toArray(), $tillRequestArray['id']), $tillRequestArray);
            } else {
                $cashUpEntity->addTill($this->updateTillDenominations(new TillDenominations(), $tillRequestArray));
            }
        }

        foreach ($cashUpEntity->getReceipts()->toArray() as $existingReceipt) { /** @var Receipt $existingReceipt */
            $matchingReceiptsInRequest = array_filter($request->request->get('receipts'), function ($receipt) use ($existingReceipt) { return array_key_exists('id', $receipt) && $receipt['id'] === $existingReceipt->getId(); });
            if (sizeof($matchingReceiptsInRequest) === 0) {
                $cashUpEntity->removeReceipt($existingReceipt);
            }
        }
        $requestedReceipts = $request->request->get('receipts');
        foreach($cashUpEntity->getReceipts() as $existingReceipt) {
            if (0 === count(array_filter($requestedReceipts, function ($requestedReceipt) use ($existingReceipt) {return array_key_exists('id', $requestedReceipt) && $requestedReceipt['id'] === $existingReceipt->getId();}))) {
                $cashUpEntity->removeReceipt($existingReceipt);
            }
        }
        foreach ($requestedReceipts as $receiptRequestArray) {
            if (array_key_exists('id', $receiptRequestArray)) {
                $this->updateReceipt($this->findReceipt($cashUpEntity->getReceipts()->toArray(), $receiptRequestArray['id']), $receiptRequestArray);
            } else {
                $cashUpEntity->addReceipt($this->updateReceipt(new Receipt(), $receiptRequestArray));
            }
        }

        foreach ($cashUpEntity->getSkims()->toArray() as $existingSkim) { /** @var CashUpSkim $existingSkim */
            $matchingSkimsInRequest = array_filter($request->request->get('skims'), function ($skim) use ($existingSkim) { return array_key_exists('id', $skim) && $skim['id'] === $existingSkim->getId(); });
            if (sizeof($matchingSkimsInRequest) === 0) {
                $cashUpEntity->removeSkim($existingSkim);
            }
        }
        $requestedSkims = $request->request->get('skims');
        foreach($cashUpEntity->getSkims() as $existingSkim) {
            if (0 === count(array_filter($requestedSkims, function ($requestedSkim) use ($existingSkim) {return array_key_exists('id', $requestedSkim) && $requestedSkim['id'] === $existingSkim->getId();}))) {
                $cashUpEntity->removeSkim($existingSkim);
            }
        }
        foreach ($requestedSkims as $skimRequestArray) {
            if (array_key_exists('id', $skimRequestArray)) {
                $this->updateSkim($this->findSkim($cashUpEntity->getSkims()->toArray(), $skimRequestArray['id']), $skimRequestArray);
            } else {
                $cashUpEntity->addSkim($this->updateSkim(new Skim(), $skimRequestArray));
            }
        }

        foreach ($cashUpEntity->getChanges()->toArray() as $existingChange) { /** @var CashUpChange $existingChange */
            $matchingChangesInRequest = array_filter($request->request->get('changes'), function ($change) use ($existingChange) { return array_key_exists('id', $change) && $change['id'] === $existingChange->getId(); });
            if (sizeof($matchingChangesInRequest) === 0) {
                $cashUpEntity->removeChange($existingChange);
            }
        }
        $requestedChanges = $request->request->get('changes');
        foreach($cashUpEntity->getChanges() as $existingChange) {
            if (0 === count(array_filter($requestedChanges, function ($requestedChange) use ($existingChange) {return array_key_exists('id', $requestedChange) && $requestedChange['id'] === $existingChange->getId();}))) {
                $cashUpEntity->removeChange($existingChange);
            }
        }
        foreach ($requestedChanges as $changeRequestArray) {
            if (array_key_exists('id', $changeRequestArray)) {
                $this->updateChange($this->findChange($cashUpEntity->getChanges()->toArray(), $changeRequestArray['id']), $changeRequestArray);
            } else {
                $cashUpEntity->addChange($this->updateChange(new Change(), $changeRequestArray));
            }
        }

        $requestedDeposits = $request->request->get('deposits');
        foreach($cashUpEntity->getDeposits() as $existingDeposit) {
            if (0 === count(array_filter($requestedDeposits, function ($requestedDeposit) use ($existingDeposit) {return array_key_exists('id', $requestedDeposit) && $requestedDeposit['id'] === $existingDeposit->getId();}))) {
                $cashUpEntity->removeDeposit($existingDeposit);
            }
        }
        foreach ($request->request->get('deposits') as $depositRequestArray) {
            if (array_key_exists('id', $depositRequestArray)) {
                $this->updateDeposit($this->findDeposit($cashUpEntity->getDeposits()->toArray(), $depositRequestArray['id']), $depositRequestArray);
            } else {
                $cashUpEntity->addDeposit($this->updateDeposit(new Deposit(), $depositRequestArray));
            }
        }

        $requestedAccounts = $request->request->get('accounts');
        foreach($cashUpEntity->getAccounts() as $existingAccount) {
            if (0 === count(array_filter($requestedAccounts, function ($requestedAccount) use ($existingAccount) {return array_key_exists('id', $requestedAccount) && $requestedAccount['id'] === $existingAccount->getId();}))) {
                $cashUpEntity->removeAccount($existingAccount);
            }
        }
        foreach ($request->request->get('accounts') as $accountRequestArray) {
            if (array_key_exists('id', $accountRequestArray)) {
                $this->updateAccount($this->findAccount($cashUpEntity->getAccounts()->toArray(), $accountRequestArray['id']), $accountRequestArray);
            } else {
                $cashUpEntity->addAccount($this->updateAccount(new Account(), $accountRequestArray));
            }
        }

        return $cashUpEntity;
    }

    private function updateSafeFloatTillDenominations(SafeFloatDenominations $safeFloatDenoms, array $requestObject) {
        $safeFloatDenoms->setFiftyPounds((float) $requestObject['fiftyPounds']);
        $safeFloatDenoms->setTwentyPounds((float) $requestObject['twentyPounds']);
        $safeFloatDenoms->setTenPounds((float) $requestObject['tenPounds']);
        $safeFloatDenoms->setFivePounds((float) $requestObject['fivePounds']);
        $safeFloatDenoms->setPounds((float) $requestObject['pounds']);
        $safeFloatDenoms->setFiftyPence((float) $requestObject['fiftyPence']);
        $safeFloatDenoms->setTwentyPence((float) $requestObject['twentyPence']);
        $safeFloatDenoms->setTenPence((float) $requestObject['tenPence']);
        $safeFloatDenoms->setFivePence((float) $requestObject['fivePence']);
        $safeFloatDenoms->setInitials($requestObject['initials']);
        return $safeFloatDenoms;
    }

    /**
     * @param TillDenominations[] $tills
     * @param int $id
     * @return TillDenominations|null
     */
    private function findTill(array $tills, int $id): TillDenominations {
        foreach ($tills as $till) {
            if ($till->getId() === $id) {
                return $till;
            }
        }
        return null;
    }

    private function updateTillDenominations(TillDenominations $tillDenominations, array $requestObject) {
        $tillDenominations->setFiftyPounds((float) $requestObject['fiftyPounds']);
        $tillDenominations->setTwentyPounds((float) $requestObject['twentyPounds']);
        $tillDenominations->setTenPounds((float) $requestObject['tenPounds']);
        $tillDenominations->setFivePounds((float) $requestObject['fivePounds']);
        $tillDenominations->setPounds((float) $requestObject['pounds']);
        $tillDenominations->setFiftyPence((float) $requestObject['fiftyPence']);
        $tillDenominations->setTwentyPence((float) $requestObject['twentyPence']);
        $tillDenominations->setTenPence((float) $requestObject['tenPence']);
        $tillDenominations->setFivePence((float) $requestObject['fivePence']);
        $tillDenominations->setAmex((float) $requestObject['amex']);
        $tillDenominations->setVisa((float) $requestObject['visa']);
        $tillDenominations->setFloatAmnt((float) $requestObject['float_amnt']);
        $tillDenominations->setZRead((float) $requestObject['zRead']);
        $tillDenominations->setCoins((float) $requestObject['coins']);
        return $tillDenominations;
    }

    /**
     * @param Receipt[] $receipts
     * @param int $id
     * @return Receipt|null
     */
    private function findReceipt(array $receipts, int $id): Receipt {
        foreach ($receipts as $receipt) {
            if ($receipt->getId() === $id) {
                return $receipt;
            }
        }
        return null;
    }

    /**
     * @param CashUpSkim[] $skims
     * @param int $id
     * @return CashUpSkim|null
     */
    private function findSkim(array $skims, int $id): CashUpSkim {
        foreach ($skims as $skim) {
            if ($skim->getId() === $id) {
                return $skim;
            }
        }
        return null;
    }

    /**
     * @param CashUpChange[] $changes
     * @param int $id
     * @return CashUpChange|null
     */
    private function findChange(array $changes, int $id): CashUpChange {
        foreach ($changes as $change) {
            if ($change->getId() === $id) {
                return $change;
            }
        }
        return null;
    }

    /**
     * @param Deposit[] $deposits
     * @param int $id
     * @return Deposit|null
     */
    private function findDeposit(array $deposits, int $id): Deposit {
        foreach ($deposits as $deposit) {
            if ($deposit->getId() === $id) {
                return $deposit;
            }
        }
        return null;
    }

    /**
     * @param Account[] $accounts
     * @param int $id
     * @return Account|null
     */
    private function findAccount(array $accounts, int $id): Account {
        foreach ($accounts as $account) {
            if ($account->getId() === $id) {
                return $account;
            }
        }
        return null;
    }

    private function updateReceipt(Receipt $receipt, array $requestObject) {
        $receipt->setAmount($requestObject['amount']);
        $receipt->setDescription($requestObject['description']);
        return $receipt;
    }

    private function updateSkim(CashUpSkim $skim, array $requestObject) {
        $skim->setAmount($requestObject['amount'])
            ->setInitials($requestObject['initials'])
            ->setWitness($requestObject['witness']);
        return $skim;
    }

    private function updateChange(CashUpChange $change, array $requestObject) {
        $change->setAmount($requestObject['amount'])
            ->setInitials($requestObject['initials'])
            ->setWitness($requestObject['witness']);
        return $change;
    }

    private function updateDeposit(Deposit $deposit, array $requestObject) {
        $deposit->setAmount($requestObject['amount']);
        $deposit->setDescription($requestObject['description']);
        return $deposit;
    }

    private function updateAccount(Account $account, array $requestObject) {
        $account->setAmount($requestObject['amount']);
        $account->setDescription($requestObject['description']);
        return $account;
    }

    private function updateCashUpEntity(CashUp $cashUp, ParameterBag $requestObject, DateTimeInterface $date): CashUp
    {
        $cashUp->setManagerOnDuty($requestObject->get('mod'));
        $cashUp->setDate($date);
        $cashUp->setDailyNotes($requestObject->get('dailyNotes'));
        $cashUp->setChargeToAccount($requestObject->get('chargeToAccount'));
        $cashUp->setDepositRedeemed($requestObject->get('depositRedeemed'));
        $cashUp->setCompsWet($requestObject->get('compsWet'));
        $cashUp->setDiscountStaffDry((float)$requestObject->get('dStaffDry'));
        $cashUp->setDiscountCustomersWet((float)$requestObject->get('dCustomersWet'));
        $cashUp->setDiscountCustomersDry((float)$requestObject->get('dCustomersDry'));
        $cashUp->setDiscountCustomersCoffee((float)$requestObject->get('dCustomersCoffee'));
        $cashUp->setFwtWet((float)$requestObject->get('fwtWet'));
        $cashUp->setComoInDrawer((float)$requestObject->get('comoInDrawer'));
        $cashUp->setamexTots((float)$requestObject->get('amexTots'));
        $cashUp->setvisaMcTots((float)$requestObject->get('visaMcTots'));
        $cashUp->setSpendStaffPoints((float)$requestObject->get('spendStaffPts'));
        $cashUp->setComoDiscountAsset((float)$requestObject->get('comoDiscAsset'));
        $cashUp->setTakeDry((float)$requestObject->get('takeDry'));
        $cashUp->setTakeCoffee((float)$requestObject->get('takeCoffee'));
        $cashUp->setTakeGiftCard((float)$requestObject->get('takeGiftCard'));
        $cashUp->setTakeVouchersDry((float)$requestObject->get('takeVouchersDry'));
        $cashUp->setTakeVouchersHot((float)$requestObject->get('takeVouchersHot'));
        $cashUp->setTakeVouchersWet((float)$requestObject->get('takeVouchersWet'));
        $cashUp->setTakeDepositPaid((float)$requestObject->get('takeDepositPaid'));
        $cashUp->setPaidOutAmount((float)$requestObject->get('paidOutAmnt'));
        $cashUp->setPaidOutTo($requestObject->get('paidOutTo'));
        $cashUp->setBanked((float)$requestObject->get('banked'));
        $cashUp->setCashAdvantageBag($requestObject->get('cashAdvantageBag'));
        $cashUp->setCashAdvantageBagSeenBy($requestObject->get('cashAdvantageBagSeenBy'));
        $cashUp->setBankedPm((float)$requestObject->get('bankedPm'));
        $cashUp->setCashAdvantageBagPm($requestObject->get('cashAdvantageBagPm'));
        $cashUp->setCashAdvantageBagSeenByPm($requestObject->get('cashAdvantageBagSeenByPm'));
        $cashUp->setSfdNotes($requestObject->get('sfdNotes'));
        $cashUp->setPubSecuredBy($requestObject->get('pubSecuredBy'));
        $cashUp->setBarClosedBy($requestObject->get('barClosedBy'));
        $cashUp->setFloorClosedBy($requestObject->get('floorClosedBy'));
        $cashUp->setNextDoorBy($requestObject->get('nextDoorBy'));
        $cashUp->setPaypal($requestObject->get('paypal'));
        $cashUp->setDeliveroo($requestObject->get('deliveroo'));
        return $cashUp;
    }
}