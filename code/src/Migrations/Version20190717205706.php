<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190717205706 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE cash_up ADD banked_pm DOUBLE PRECISION NOT NULL, ADD cash_advantage_bag_pm VARCHAR(255) NOT NULL, ADD cash_advantage_bag_seen_by_pm VARCHAR(255) NOT NULL;');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE cash_up DROP banked_pm, DROP cash_advantage_bag_pm, DROP cash_advantage_bag_seen_by_pm;');
    }
}
