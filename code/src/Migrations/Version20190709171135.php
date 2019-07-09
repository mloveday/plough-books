<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190709171135 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE cash_up ADD take_vouchers_wet DOUBLE PRECISION NOT NULL DEFAULT 0, ADD take_vouchers_dry DOUBLE PRECISION NOT NULL DEFAULT 0, ADD take_vouchers_hot DOUBLE PRECISION NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE cash_up DROP take_vouchers_wet, DROP take_vouchers_dry, DROP take_vouchers_hot');
    }
}
