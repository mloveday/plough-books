<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20181229200008 extends AbstractMigration
{
    public function up(Schema $schema) : void {
        $this->addSql('ALTER TABLE actual_shift MODIFY staff_role_id INT NOT NULL');
        $this->addSql('ALTER TABLE planned_shift MODIFY staff_role_id INT NOT NULL');
    }

    public function down(Schema $schema) : void {
    }
}
