<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181112105730 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE actual_shift (id INT AUTO_INCREMENT NOT NULL, staff_member_id INT NOT NULL, rota_id INT NOT NULL, hourly_rate DOUBLE PRECISION NOT NULL, start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, total_breaks DOUBLE PRECISION NOT NULL, INDEX IDX_8A24458744DB03B1 (staff_member_id), INDEX IDX_8A2445879F169B8 (rota_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE planned_shift (id INT AUTO_INCREMENT NOT NULL, staff_member_id INT NOT NULL, rota_id INT NOT NULL, hourly_rate DOUBLE PRECISION NOT NULL, start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, total_breaks DOUBLE PRECISION NOT NULL, INDEX IDX_2B0E8CD144DB03B1 (staff_member_id), INDEX IDX_2B0E8CD19F169B8 (rota_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE staff_role (id INT AUTO_INCREMENT NOT NULL, role VARCHAR(255) NOT NULL, order_in_rota INT NOT NULL, status VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE staff_member (id INT AUTO_INCREMENT NOT NULL, staff_role_id INT NOT NULL, name VARCHAR(255) NOT NULL, current_hourly_rate DOUBLE PRECISION NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_759948C38AB5351A (staff_role_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rota (id INT AUTO_INCREMENT NOT NULL, constants_id INT NOT NULL, date DATETIME NOT NULL, forecast_revenue DOUBLE PRECISION NOT NULL, target_labour_rate DOUBLE PRECISION NOT NULL, status VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_D21FD62A3AC832F4 (constants_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE constants (id INT AUTO_INCREMENT NOT NULL, date DATETIME NOT NULL, fixed_costs DOUBLE PRECISION NOT NULL, labour_rate DOUBLE PRECISION NOT NULL, vat_multiplier DOUBLE PRECISION NOT NULL, bar_proportion_of_revenue DOUBLE PRECISION NOT NULL, hours_per_short_break DOUBLE PRECISION NOT NULL, short_break_duration DOUBLE PRECISION NOT NULL, hours_per_long_break DOUBLE PRECISION NOT NULL, long_break_duration DOUBLE PRECISION NOT NULL, ers_threshold DOUBLE PRECISION NOT NULL, ers_percent_above_threshold DOUBLE PRECISION NOT NULL, holiday_linear_percent DOUBLE PRECISION NOT NULL, pension_linear_percent DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE actual_shift ADD CONSTRAINT FK_8A24458744DB03B1 FOREIGN KEY (staff_member_id) REFERENCES staff_member (id)');
        $this->addSql('ALTER TABLE actual_shift ADD CONSTRAINT FK_8A2445879F169B8 FOREIGN KEY (rota_id) REFERENCES rota (id)');
        $this->addSql('ALTER TABLE planned_shift ADD CONSTRAINT FK_2B0E8CD144DB03B1 FOREIGN KEY (staff_member_id) REFERENCES staff_member (id)');
        $this->addSql('ALTER TABLE planned_shift ADD CONSTRAINT FK_2B0E8CD19F169B8 FOREIGN KEY (rota_id) REFERENCES rota (id)');
        $this->addSql('ALTER TABLE staff_member ADD CONSTRAINT FK_759948C38AB5351A FOREIGN KEY (staff_role_id) REFERENCES staff_role (id)');
        $this->addSql('ALTER TABLE rota ADD CONSTRAINT FK_D21FD62A3AC832F4 FOREIGN KEY (constants_id) REFERENCES constants (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE staff_member DROP FOREIGN KEY FK_759948C38AB5351A');
        $this->addSql('ALTER TABLE actual_shift DROP FOREIGN KEY FK_8A24458744DB03B1');
        $this->addSql('ALTER TABLE planned_shift DROP FOREIGN KEY FK_2B0E8CD144DB03B1');
        $this->addSql('ALTER TABLE actual_shift DROP FOREIGN KEY FK_8A2445879F169B8');
        $this->addSql('ALTER TABLE planned_shift DROP FOREIGN KEY FK_2B0E8CD19F169B8');
        $this->addSql('ALTER TABLE rota DROP FOREIGN KEY FK_D21FD62A3AC832F4');
        $this->addSql('DROP TABLE actual_shift');
        $this->addSql('DROP TABLE planned_shift');
        $this->addSql('DROP TABLE staff_role');
        $this->addSql('DROP TABLE staff_member');
        $this->addSql('DROP TABLE rota');
        $this->addSql('DROP TABLE constants');
    }
}
