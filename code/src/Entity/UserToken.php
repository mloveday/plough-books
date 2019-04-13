<?php

namespace App\Entity;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\InvalidArgumentException;

class UserToken implements TokenInterface {

    private $email;
    private $token;

    public function __construct(string $email, string $token) {
        $this->email = $email;
        $this->token = $token;
    }

    public function serialize() {
        return $this->__toString();
    }

    public function unserialize($serialized) {
        $decoded = json_decode($serialized);
        return new UserToken($decoded->email, $decoded->token);
    }

    public function __toString() {
        return json_encode((object)['email' => $this->email, 'token' => $this->token]);
    }

    public function getRoles() {
        return [];
    }

    public function getCredentials() {
        return '';
    }

    public function getUser() {
        return $this->email;
    }

    public function setUser($user) {
        $this->email = $user;
    }

    public function getUsername() {
        return $this->email;
    }

    public function isAuthenticated() {
        return true;
    }

    public function setAuthenticated($isAuthenticated) {
        return;
    }

    public function eraseCredentials() {
        return;
    }

    public function getAttributes() {
        return [];
    }

    public function setAttributes(array $attributes) {
        return;
    }

    public function hasAttribute($name) {
        return false;
    }

    public function getAttribute($name) {
        throw new InvalidArgumentException();
    }

    public function setAttribute($name, $value) {
        return;
    }
}