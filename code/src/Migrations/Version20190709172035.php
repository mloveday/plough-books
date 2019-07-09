<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190709172035 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE account (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, description VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_7D3656A43611BF30 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE deposit (id INT AUTO_INCREMENT NOT NULL, cash_up_id INT DEFAULT NULL, description VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_95DB9D393611BF30 (cash_up_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A43611BF30 FOREIGN KEY (cash_up_id) REFERENCES cash_up (id)');
        $this->addSql('ALTER TABLE deposit ADD CONSTRAINT FK_95DB9D393611BF30 FOREIGN KEY (cash_up_id) REFERENCES cash_up (id)');
    }

    public function down(Schema $schema): void {
        $this->addSql('DROP TABLE account');
        $this->addSql('DROP TABLE deposit');
    }
}
