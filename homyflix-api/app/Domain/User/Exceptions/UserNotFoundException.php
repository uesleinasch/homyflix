<?php

namespace App\Domain\User\Exceptions;

use Exception;

class UserNotFoundException extends Exception
{
    public function __construct(string $message = 'Usuário não encontrado.', int $code = 404, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
} 