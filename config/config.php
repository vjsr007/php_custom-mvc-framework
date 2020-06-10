<?php

/** Configuration Variables **/
define ('DEVELOPMENT_ENVIRONMENT',true);

define('DB_NAME', 'frameworkmvc');
define('DB_USER', 'vj007root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
if(DEVELOPMENT_ENVIRONMENT){
    define('BASE_PATH','http://localhost:8080/FrameworkPHP');
}
else{
    define('BASE_PATH','http://www.appliedsw.com/vjsr007');
}
define('PAGINATE_LIMIT', '5');