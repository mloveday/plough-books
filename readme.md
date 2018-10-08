#dev set up
##Set up backend

* Install PHP 7.2, composer, download php_xdebug.dll
    * Rename xdebug dll to `php_xdebug.dll` and store in the php install directory
    * Ensure `php.ini` from `/plough-books-back/infrastructure` is in the php directory
* In a terminal, navigate to plough-books-back, run `composer install`

##Run the backend

* In a terminal, navigate to plough-books-back, run `php bin/console server:run`