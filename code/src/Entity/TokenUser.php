<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;

class TokenUser implements UserInterface {
    private $email;

    public function __construct(string $email) {
        $this->email = $email;
    }

    public function getRoles() {
        return [new \Symfony\Component\Security\Core\Role\Role('user')];
    }

    public function getPassword() {
        return '';
    }

    public function getSalt() {
        return '';
    }

    public function getUsername() {
        return $this->email;
    }

    public function eraseCredentials() {
        return;
    }

}