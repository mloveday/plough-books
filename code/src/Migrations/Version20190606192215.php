<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190606192215 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE staff_member ADD default_off_floor TINYINT(1) NOT NULL DEFAULT 0;');
        $this->addSql('ALTER TABLE staff_member ALTER COLUMN default_off_floor DROP DEFAULT;');

    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE staff_member DROP default_off_floor');
    }
}
