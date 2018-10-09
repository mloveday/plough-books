# dev set up
## Set up backend

### Running via vagrant box
* Install Vagrant and VMWare VirtualBox
* In a terminal, navigate to `vagrant`, run `vagrant up`

### Running locally
* Install php 7.2, mySQL 5.7, composer
* In a terminal, navigate to plough-books-back and run
    * `composer install`
    * `php bin/console server:run`