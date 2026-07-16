<?php

namespace App\Services\DiscordLogger;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;
use Illuminate\Support\Facades\Http;

class DiscordWebhookHandler extends AbstractProcessingHandler
{

    public $myConfig;

    public function __construct(array $config)
    {
        $this->myConfig = $config;
    }


    protected function write(LogRecord $record): void
    {
        try {
            $trace = '';

            $exception = $record['context']['exception'] ?? '';
            if (!empty($exception)) {
                $trace = "On {$exception->getFile()}:{$exception->getLine()} (code {$exception->getCode()})\n" .
                    "Stacktrace:\n" .
                    $exception->getTraceAsString();
            }

            Http::attach(
                'payload_json',
                json_encode(get_object_vars($record) + ['trace' => $trace]),
                'payload_log.txt'
            )->post($this->myConfig['url'], [
                    'username' => $this->myConfig['username']
                    . ' (' . gethostname() . ')',
                    'content' => ':japanese_ogre: ' . $record->message
                ]);
        } catch (\Throwable $th) {
            //throw $th;
            //do nothing
        }
    }
}