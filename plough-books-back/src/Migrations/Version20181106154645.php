<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20181106154645 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('INSERT INTO role (`role`, `manages_users`) VALUES (\'admin\', 1)');
        $this->addSql('INSERT INTO user (`role_id`, `email`, `whitelisted`, `blacklisted`) VALUES ((SELECT id FROM role WHERE role=\'admin\' LIMIT 1), \'miles@theploughharborne.co.uk\', 1, 0)');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DELETE FROM user WHERE `email` = \'miles@theploughharborne.co.uk\'');
        $this->addSql('DELETE FROM role WHERE `role` = \'admin\'');
    }
}
