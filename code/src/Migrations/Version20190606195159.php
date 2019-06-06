<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190606195159 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE actual_shift ADD off_floor TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE actual_shift ALTER COLUMN off_floor DROP DEFAULT;');
        $this->addSql('ALTER TABLE planned_shift ADD off_floor TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE planned_shift ALTER COLUMN off_floor DROP DEFAULT;');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE actual_shift DROP off_floor');
        $this->addSql('ALTER TABLE planned_shift DROP off_floor');
    }
}
