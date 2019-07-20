<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190720094816 extends AbstractMigration {
    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE rota ADD staff_level_modifiers JSON NOT NULL');
        $this->addSql('UPDATE rota SET staff_level_modifiers = \'[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\'');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE rota DROP staff_level_modifiers');
    }
}
