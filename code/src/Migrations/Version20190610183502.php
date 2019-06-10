<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190610183502 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE staff_member ADD order_in_rota INT NOT NULL DEFAULT 2');
        $this->addSql('ALTER TABLE staff_member ALTER COLUMN order_in_rota DROP DEFAULT;');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE staff_member DROP order_in_rota');
    }
}
