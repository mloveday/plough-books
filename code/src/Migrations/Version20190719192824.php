<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190719192824 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE cash_up_change (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, initials VARCHAR(255) NOT NULL, witness VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_4057FE209F169B8 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE cash_up_skim (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, initials VARCHAR(255) NOT NULL, witness VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_9B7039A49F169B8 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cash_up_change ADD CONSTRAINT FK_4057FE209F169B8 FOREIGN KEY (cash_up_id) REFERENCES rota (id)');
        $this->addSql('ALTER TABLE cash_up_skim ADD CONSTRAINT FK_9B7039A49F169B8 FOREIGN KEY (cash_up_id) REFERENCES rota (id)');
    }

    public function down(Schema $schema): void {
        $this->addSql('DROP TABLE cash_up_change');
        $this->addSql('DROP TABLE cash_up_skim');
    }
}
