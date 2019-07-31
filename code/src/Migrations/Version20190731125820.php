<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190731125820 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE holiday (id INT AUTO_INCREMENT NOT NULL, staff_member_id INT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, INDEX IDX_DC9AB23444DB03B1 (staff_member_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE holiday ADD CONSTRAINT FK_DC9AB23444DB03B1 FOREIGN KEY (staff_member_id) REFERENCES staff_member (id)');

    }

    public function down(Schema $schema): void {
        $this->addSql('DROP TABLE holiday');
    }
}
