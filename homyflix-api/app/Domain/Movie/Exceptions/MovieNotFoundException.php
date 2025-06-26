<?php

namespace App\Domain\Movie\Exceptions;

use Exception;

class MovieNotFoundException extends Exception
{
    public function __construct(string $message = 'Filme não encontrado.', int $code = 404, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
