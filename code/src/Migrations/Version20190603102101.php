<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190603102101 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE cash_up ADD paypal DOUBLE PRECISION NOT NULL DEFAULT 0, ADD deliveroo DOUBLE PRECISION NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('ALTER TABLE cash_up DROP paypal, DROP deliveroo');
    }
}
