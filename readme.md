# dev set up
## Set up backend

### Running via vagrant box
* Install Vagrant and VMWare VirtualBox
* In a terminal, navigate to `vagrant`, run `vagrant up`
* run `vagrant ssh`, in the vagrant box...
    * navigate to `/vagrant/code`
    * install dependencies with `composer install`
    * run db migrations with `php bin/console doctrine:migrations:migrate`

### Running locally
* Install php 7.2, mySQL 5.7, composer
* In a terminal, navigate to plough-books-back and run
    * `composer install`
    * `php bin/console server:run`
    
    
    
    
# development
## Database
* To add a db table with associated entity, ssh into the vagrant box, then...
    * `php bin/console make:entity` to make a new entity & repo
    * `php bin/console make:migration` to make a db migration