<?php

namespace App\Service\Parsing;

use App\Entity\CashUp;
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
        foreach ($request->request->get('receipts') as $receiptRequestArray) {
            if (array_key_exists('id', $receiptRequestArray)) {
                $this->updateReceipt($this->findReceipt($cashUpEntity->getReceipts()->toArray(), $receiptRequestArray['id']), $receiptRequestArray);
            } else {
                $cashUpEntity->addReceipt($this->updateReceipt(new Receipt(), $receiptRequestArray));
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

    private function updateReceipt(Receipt $receipt, array $requestObject) {
        $receipt->setAmount($requestObject['amount']);
        $receipt->setDescription($requestObject['description']);
        return $receipt;
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
        $cashUp->setTakeDepositPaid((float)$requestObject->get('takeDepositPaid'));
        $cashUp->setPaidOutAmount((float)$requestObject->get('paidOutAmnt'));
        $cashUp->setPaidOutTo($requestObject->get('paidOutTo'));
        $cashUp->setBanked((float)$requestObject->get('banked'));
        $cashUp->setCashAdvantageBag($requestObject->get('cashAdvantageBag'));
        $cashUp->setCashAdvantageBagSeenBy($requestObject->get('cashAdvantageBagSeenBy'));
        $cashUp->setsfdNotes($requestObject->get('sfdNotes'));
        $cashUp->setpubSecuredBy($requestObject->get('pubSecuredBy'));
        $cashUp->setbarClosedBy($requestObject->get('barClosedBy'));
        $cashUp->setfloorClosedBy($requestObject->get('floorClosedBy'));
        $cashUp->setnextDoorBy($requestObject->get('nextDoorBy'));
        return $cashUp;
    }
}