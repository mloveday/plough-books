<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190727201239 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE error_log (id INT AUTO_INCREMENT NOT NULL, timestamp DATETIME NOT NULL, message LONGTEXT NOT NULL, trace LONGTEXT NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
    }

    public function down(Schema $schema): void {
        $this->addSql('DROP TABLE error_log');
    }
}
