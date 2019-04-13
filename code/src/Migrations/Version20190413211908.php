<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20190413211908 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        $this->addSql('CREATE TABLE actual_shift_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_dcedda11be4d9196c1496d7f0f39669b_idx (type), INDEX object_id_dcedda11be4d9196c1496d7f0f39669b_idx (object_id), INDEX blame_id_dcedda11be4d9196c1496d7f0f39669b_idx (blame_id), INDEX created_at_dcedda11be4d9196c1496d7f0f39669b_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE cash_up_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_a9191738611e6d496574184efd92a8e8_idx (type), INDEX object_id_a9191738611e6d496574184efd92a8e8_idx (object_id), INDEX blame_id_a9191738611e6d496574184efd92a8e8_idx (blame_id), INDEX created_at_a9191738611e6d496574184efd92a8e8_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE constants_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_05eebd4d6d9ca51ce274e877fc2c620a_idx (type), INDEX object_id_05eebd4d6d9ca51ce274e877fc2c620a_idx (object_id), INDEX blame_id_05eebd4d6d9ca51ce274e877fc2c620a_idx (blame_id), INDEX created_at_05eebd4d6d9ca51ce274e877fc2c620a_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE domain_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_9cf67ce8de443ab58ecf7c97feae3342_idx (type), INDEX object_id_9cf67ce8de443ab58ecf7c97feae3342_idx (object_id), INDEX blame_id_9cf67ce8de443ab58ecf7c97feae3342_idx (blame_id), INDEX created_at_9cf67ce8de443ab58ecf7c97feae3342_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE planned_shift_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_21722b38f38219542e772f36f831809e_idx (type), INDEX object_id_21722b38f38219542e772f36f831809e_idx (object_id), INDEX blame_id_21722b38f38219542e772f36f831809e_idx (blame_id), INDEX created_at_21722b38f38219542e772f36f831809e_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE receipt_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_36e20409f143a5cf2994670422578f6a_idx (type), INDEX object_id_36e20409f143a5cf2994670422578f6a_idx (object_id), INDEX blame_id_36e20409f143a5cf2994670422578f6a_idx (blame_id), INDEX created_at_36e20409f143a5cf2994670422578f6a_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_92317bf7adb4788531df0b1cb910b5fc_idx (type), INDEX object_id_92317bf7adb4788531df0b1cb910b5fc_idx (object_id), INDEX blame_id_92317bf7adb4788531df0b1cb910b5fc_idx (blame_id), INDEX created_at_92317bf7adb4788531df0b1cb910b5fc_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rota_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_468f177dd4e4fdc97a783f5a136689e8_idx (type), INDEX object_id_468f177dd4e4fdc97a783f5a136689e8_idx (object_id), INDEX blame_id_468f177dd4e4fdc97a783f5a136689e8_idx (blame_id), INDEX created_at_468f177dd4e4fdc97a783f5a136689e8_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE staff_member_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_6d56788ea6068ca9ecc852e0366fea16_idx (type), INDEX object_id_6d56788ea6068ca9ecc852e0366fea16_idx (object_id), INDEX blame_id_6d56788ea6068ca9ecc852e0366fea16_idx (blame_id), INDEX created_at_6d56788ea6068ca9ecc852e0366fea16_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE staff_role_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_fac1ab21e15a4d4d8f22713283124dcc_idx (type), INDEX object_id_fac1ab21e15a4d4d8f22713283124dcc_idx (object_id), INDEX blame_id_fac1ab21e15a4d4d8f22713283124dcc_idx (blame_id), INDEX created_at_fac1ab21e15a4d4d8f22713283124dcc_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_audit (id INT UNSIGNED AUTO_INCREMENT NOT NULL, type VARCHAR(10) NOT NULL, object_id VARCHAR(255) NOT NULL, diffs JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', blame_id INT UNSIGNED DEFAULT NULL, blame_user VARCHAR(255) DEFAULT NULL, blame_user_fqdn VARCHAR(255) DEFAULT NULL, blame_user_firewall VARCHAR(100) DEFAULT NULL, ip VARCHAR(45) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX type_e06395edc291d0719bee26fd39a32e8a_idx (type), INDEX object_id_e06395edc291d0719bee26fd39a32e8a_idx (object_id), INDEX blame_id_e06395edc291d0719bee26fd39a32e8a_idx (blame_id), INDEX created_at_e06395edc291d0719bee26fd39a32e8a_idx (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DROP TABLE actual_shift_audit');
        $this->addSql('DROP TABLE cash_up_audit');
        $this->addSql('DROP TABLE constants_audit');
        $this->addSql('DROP TABLE domain_audit');
        $this->addSql('DROP TABLE planned_shift_audit');
        $this->addSql('DROP TABLE receipt_audit');
        $this->addSql('DROP TABLE role_audit');
        $this->addSql('DROP TABLE rota_audit');
        $this->addSql('DROP TABLE staff_member_audit');
        $this->addSql('DROP TABLE staff_role_audit');
        $this->addSql('DROP TABLE user_audit');
    }
}
