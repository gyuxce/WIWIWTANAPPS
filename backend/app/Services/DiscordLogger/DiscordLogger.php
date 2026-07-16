<?php

namespace App\Services\DiscordLogger;

use InvalidArgumentException;
use Monolog\Logger;

class DiscordLogger
{

    public $myConfig;


    public function __invoke(array $config): Logger
    {
        if (empty($config['url'])) {
            throw new InvalidArgumentException('You must set the `url` key in your discord channel configuration');
        }

        if (empty($config['username'])) {
            throw new InvalidArgumentException('You must set the `username` key in your discord channel configuration');
        }

        $this->myConfig = $config;

        return new Logger($config['username'], [$this->handleLogger()]);
    }

    public function handleLogger()
    {

        return new DiscordWebhookHandler($this->myConfig);
    }
}