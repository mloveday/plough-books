<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190605101440 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE actual_shift CHANGE type type enum(\'bar\', \'kitchen\', \'ancillary\')');
        $this->addSql('ALTER TABLE cash_up CHANGE paypal paypal DOUBLE PRECISION NOT NULL, CHANGE deliveroo deliveroo DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE planned_shift CHANGE type type enum(\'bar\', \'kitchen\', \'ancillary\')');
        $this->addSql('ALTER TABLE rota CHANGE status status enum(\'imported\', \'new\', \'draft\', \'rota_complete\', \'sign_in_complete\')');
        $this->addSql('ALTER TABLE staff_member CHANGE status status enum(\'imported\', \'active\', \'inactive\')');
        $this->addSql('ALTER TABLE staff_role CHANGE status status enum(\'imported\', \'active\', \'inactive\')');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE actual_shift CHANGE type type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE cash_up CHANGE paypal paypal DOUBLE PRECISION DEFAULT \'0\' NOT NULL, CHANGE deliveroo deliveroo DOUBLE PRECISION DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE planned_shift CHANGE type type VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE rota CHANGE status status VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE staff_member CHANGE status status VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE staff_role CHANGE status status VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
    }
}
