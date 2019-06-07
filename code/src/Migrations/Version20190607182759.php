<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190607182759 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE constants ADD kitchen_hours_per_short_break DOUBLE PRECISION NOT NULL, ADD kitchen_short_break_duration DOUBLE PRECISION NOT NULL, ADD kitchen_hours_per_long_break DOUBLE PRECISION NOT NULL, ADD kitchen_long_break_duration DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE constants DROP kitchen_hours_per_short_break, DROP kitchen_short_break_duration, DROP kitchen_hours_per_long_break, DROP kitchen_long_break_duration');
    }
}
