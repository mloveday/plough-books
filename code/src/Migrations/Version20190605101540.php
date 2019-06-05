<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190605101540 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE rota_staffing (id INT AUTO_INCREMENT NOT NULL, staff_levels JSON NOT NULL, work_type enum(\'bar\', \'kitchen\', \'ancillary\'), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rota_staffing_template (id INT AUTO_INCREMENT NOT NULL, staff_levels JSON NOT NULL, revenue INT NOT NULL, work_type enum(\'bar\', \'kitchen\', \'ancillary\'), day_of_week INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
    }

    public function down(Schema $schema): void {
        $this->addSql('DROP TABLE rota_staffing');
        $this->addSql('DROP TABLE rota_staffing_template');
    }
}
