<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20181229200009 extends AbstractMigration
{
    public function up(Schema $schema) : void {
        $this->addSql("UPDATE staff_role SET status = 'imported' WHERE status = 'import'");
        $this->addSql("ALTER TABLE rota MODIFY status ENUM('imported', 'new', 'draft', 'rota_complete', 'sign_in_complete')");
        $this->addSql("ALTER TABLE staff_member MODIFY status ENUM('imported', 'active', 'inactive')");
        $this->addSql("ALTER TABLE staff_role MODIFY status ENUM('imported', 'active', 'inactive')");
        $this->addSql("ALTER TABLE actual_shift MODIFY type ENUM('bar', 'kitchen')");
        $this->addSql("ALTER TABLE planned_shift MODIFY type ENUM('bar', 'kitchen')");
    }

    public function down(Schema $schema) : void {
    }
}
