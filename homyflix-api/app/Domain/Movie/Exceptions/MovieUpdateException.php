<?php

namespace App\Domain\Movie\Exceptions;

use Exception;

class MovieUpdateException extends Exception
{
    public function __construct(string $message = 'Erro ao atualizar o filme.', int $code = 500, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
