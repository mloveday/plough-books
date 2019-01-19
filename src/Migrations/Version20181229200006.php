<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20181229200006 extends AbstractMigration
{
    public function up(Schema $schema) : void {
        $this->addSql('ALTER TABLE actual_shift ADD staff_role_id INT NOT NULL DEFAULT 1');
        $this->addSql('ALTER TABLE actual_shift ADD CONSTRAINT FK_8A2445878AB5351A FOREIGN KEY (staff_role_id) REFERENCES staff_role (id)');
        $this->addSql('CREATE INDEX IDX_8A2445878AB5351A ON actual_shift (staff_role_id)');

        $this->addSql('ALTER TABLE planned_shift ADD staff_role_id INT NOT NULL DEFAULT 1');
        $this->addSql('ALTER TABLE planned_shift ADD CONSTRAINT FK_2B0E8CD18AB5351A FOREIGN KEY (staff_role_id) REFERENCES staff_role (id)');
        $this->addSql('CREATE INDEX IDX_2B0E8CD18AB5351A ON planned_shift (staff_role_id)');
        $this->addSql('ALTER TABLE rota CHANGE date date DATETIME NOT NULL');
    }

    public function down(Schema $schema) : void {
        $this->addSql('ALTER TABLE actual_shift DROP FOREIGN KEY FK_8A2445878AB5351A');
        $this->addSql('DROP INDEX IDX_8A2445878AB5351A ON actual_shift');
        $this->addSql('ALTER TABLE actual_shift DROP staff_role_id');
        $this->addSql('ALTER TABLE planned_shift DROP FOREIGN KEY FK_2B0E8CD18AB5351A');
        $this->addSql('DROP INDEX IDX_2B0E8CD18AB5351A ON planned_shift');
        $this->addSql('ALTER TABLE planned_shift DROP staff_role_id');
        $this->addSql('ALTER TABLE rota CHANGE date date DATE NOT NULL');
    }
}
