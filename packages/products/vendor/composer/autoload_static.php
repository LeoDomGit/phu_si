<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9a650921b26fc7a36bb903837961fe42
{
    public static $prefixLengthsPsr4 = array (
        'L' => 
        array (
            'Leo\\Products\\Providers\\' => 23,
            'Leo\\Products\\Database\\Seeders\\' => 30,
            'Leo\\Products\\Database\\Migrations\\' => 33,
            'Leo\\Products\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Leo\\Products\\Providers\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src/Providers',
        ),
        'Leo\\Products\\Database\\Seeders\\' => 
        array (
            0 => __DIR__ . '/../..' . '/database/seeders',
        ),
        'Leo\\Products\\Database\\Migrations\\' => 
        array (
            0 => __DIR__ . '/../..' . '/database/migrations',
        ),
        'Leo\\Products\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Leo\\Products\\Controllers\\ProductsController' => __DIR__ . '/../..' . '/src/Controllers/ProductsController.php',
        'Leo\\Products\\Imports\\ProductImport' => __DIR__ . '/../..' . '/src/Imports/ProductImport.php',
        'Leo\\Products\\Models\\Gallery' => __DIR__ . '/../..' . '/src/Models/Gallery.php',
        'Leo\\Products\\Models\\Products' => __DIR__ . '/../..' . '/src/Models/Products.php',
        'Leo\\Products\\Providers\\ProductsServiceProvider' => __DIR__ . '/../..' . '/src/Providers/ProductsServiceProvider.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9a650921b26fc7a36bb903837961fe42::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9a650921b26fc7a36bb903837961fe42::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9a650921b26fc7a36bb903837961fe42::$classMap;

        }, null, ClassLoader::class);
    }
}
