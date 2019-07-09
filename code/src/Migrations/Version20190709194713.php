<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190709194713 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE till_denominations ADD coins DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE till_denominations DROP coins');
    }
}
