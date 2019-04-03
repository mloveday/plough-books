# dev set up
## Set up backend

### Running locally
* Install Vagrant and VMWare VirtualBox
* In a terminal, navigate to `vagrant`, run `vagrant up`
* run `vagrant ssh`, then in the vagrant box...
    * navigate to `/vagrant/code`
    * install dependencies with `composer install`
    * compile front end (and watch for changes) using `yarn encore dev --watch`
    * (first time / on db change only) run db migrations with `php bin/console doctrine:migrations:migrate`
* Front end is served at localhost:8000

# Development
## Database
* To add a db table with associated entity, ssh into the vagrant box, navigate to `/vagrant/code`, then...
    * `php bin/console make:entity` to make a new entity & repo
    * `php bin/console make:migration` to make a db migration