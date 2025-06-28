<?php

namespace App\Domain\User\Exceptions;

use Exception;

class UserUpdateException extends Exception
{
    public function __construct(string $message = 'Erro ao atualizar o usuário.', int $code = 500, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
} 