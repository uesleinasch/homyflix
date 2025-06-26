<?php

namespace App\Domain\Movie\Exceptions;

use Exception;

class MovieCreationException extends Exception
{
    public function __construct(string $message = 'Erro ao criar o filme.', int $code = 500, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
