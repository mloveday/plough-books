<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20181107110254 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('CREATE TABLE cash_up (id INT AUTO_INCREMENT NOT NULL, sfd_morning_id INT DEFAULT NULL, sfd_evening_id INT DEFAULT NULL, date DATE NOT NULL, manager_on_duty VARCHAR(255) NOT NULL, daily_notes VARCHAR(255) NOT NULL, charge_to_account DOUBLE PRECISION NOT NULL, deposit_redeemed DOUBLE PRECISION NOT NULL, comps_wet DOUBLE PRECISION NOT NULL, discount_staff_dry DOUBLE PRECISION NOT NULL, discount_customers_wet DOUBLE PRECISION NOT NULL, discount_customers_dry DOUBLE PRECISION NOT NULL, discount_customers_coffee DOUBLE PRECISION NOT NULL, fwt_wet DOUBLE PRECISION NOT NULL, como_in_drawer DOUBLE PRECISION NOT NULL, amex_tots DOUBLE PRECISION NOT NULL, visa_mc_tots DOUBLE PRECISION NOT NULL, spend_staff_points DOUBLE PRECISION NOT NULL, como_discount_asset DOUBLE PRECISION NOT NULL, take_dry DOUBLE PRECISION NOT NULL, take_coffee DOUBLE PRECISION NOT NULL, take_gift_card DOUBLE PRECISION NOT NULL, take_deposit_paid DOUBLE PRECISION NOT NULL, paid_out_amount DOUBLE PRECISION NOT NULL, paid_out_to VARCHAR(255) NOT NULL, banked DOUBLE PRECISION NOT NULL, cash_advantage_bag VARCHAR(255) NOT NULL, cash_advantage_bag_seen_by VARCHAR(255) NOT NULL, sfd_notes VARCHAR(255) NOT NULL, pub_secured_by VARCHAR(255) NOT NULL, bar_closed_by VARCHAR(255) NOT NULL, floor_closed_by VARCHAR(255) NOT NULL, next_door_by VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_C1D785088D86B089 (sfd_morning_id), UNIQUE INDEX UNIQ_C1D78508E84C3C65 (sfd_evening_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE safe_float_denominations (id INT AUTO_INCREMENT NOT NULL, fifty_pounds DOUBLE PRECISION NOT NULL, twenty_pounds DOUBLE PRECISION NOT NULL, ten_pounds DOUBLE PRECISION NOT NULL, five_pounds DOUBLE PRECISION NOT NULL, pounds DOUBLE PRECISION NOT NULL, fifty_pence DOUBLE PRECISION NOT NULL, twenty_pence DOUBLE PRECISION NOT NULL, ten_pence DOUBLE PRECISION NOT NULL, five_pence DOUBLE PRECISION NOT NULL, initials VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE receipt (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, description VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_5399B6453611BF30 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE till_denominations (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, fifty_pounds DOUBLE PRECISION NOT NULL, twenty_pounds DOUBLE PRECISION NOT NULL, ten_pounds DOUBLE PRECISION NOT NULL, five_pounds DOUBLE PRECISION NOT NULL, pounds DOUBLE PRECISION NOT NULL, fifty_pence DOUBLE PRECISION NOT NULL, twenty_pence DOUBLE PRECISION NOT NULL, ten_pence DOUBLE PRECISION NOT NULL, five_pence DOUBLE PRECISION NOT NULL, `float_amnt` DOUBLE PRECISION NOT NULL, visa DOUBLE PRECISION NOT NULL, amex DOUBLE PRECISION NOT NULL, z_read DOUBLE PRECISION NOT NULL, INDEX IDX_4266F9F03611BF30 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cash_up ADD CONSTRAINT FK_C1D785088D86B089 FOREIGN KEY (sfd_morning_id) REFERENCES safe_float_denominations (id)');
        $this->addSql('ALTER TABLE cash_up ADD CONSTRAINT FK_C1D78508E84C3C65 FOREIGN KEY (sfd_evening_id) REFERENCES safe_float_denominations (id)');
        $this->addSql('ALTER TABLE receipt ADD CONSTRAINT FK_5399B6453611BF30 FOREIGN KEY (cash_up_id) REFERENCES cash_up (id)');
        $this->addSql('ALTER TABLE till_denominations ADD CONSTRAINT FK_4266F9F03611BF30 FOREIGN KEY (cash_up_id) REFERENCES cash_up (id)');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE receipt DROP FOREIGN KEY FK_5399B6453611BF30');
        $this->addSql('ALTER TABLE till_denominations DROP FOREIGN KEY FK_4266F9F03611BF30');
        $this->addSql('ALTER TABLE cash_up DROP FOREIGN KEY FK_C1D785088D86B089');
        $this->addSql('ALTER TABLE cash_up DROP FOREIGN KEY FK_C1D78508E84C3C65');
        $this->addSql('DROP TABLE cash_up');
        $this->addSql('DROP TABLE safe_float_denominations');
        $this->addSql('DROP TABLE receipt');
        $this->addSql('DROP TABLE till_denominations');
    }
}
