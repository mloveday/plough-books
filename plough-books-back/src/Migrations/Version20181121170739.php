<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181121170739 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE actual_shift ADD type VARCHAR(255) NOT NULL, CHANGE staff_member_id staff_member_id INT DEFAULT NULL, CHANGE rota_id rota_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE planned_shift ADD type VARCHAR(255) NOT NULL, CHANGE staff_member_id staff_member_id INT DEFAULT NULL, CHANGE rota_id rota_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE staff_role CHANGE type type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE rota DROP type');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE actual_shift DROP type, CHANGE staff_member_id staff_member_id INT NOT NULL, CHANGE rota_id rota_id INT NOT NULL');
        $this->addSql('ALTER TABLE planned_shift DROP type, CHANGE staff_member_id staff_member_id INT NOT NULL, CHANGE rota_id rota_id INT NOT NULL');
        $this->addSql('ALTER TABLE rota ADD type VARCHAR(255) DEFAULT \'bar\' NOT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE staff_role CHANGE type type VARCHAR(255) DEFAULT \'bar\' NOT NULL COLLATE utf8mb4_unicode_ci');
    }
}
