<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Domain\User\Exceptions\UserNotFoundException;
use App\Domain\User\Exceptions\UserUpdateException;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserRepository implements UserRepositoryInterface
{
    public function create(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function update(int $id, array $data): User
    {
        try {
            $user = $this->findById($id);
            
            if (!$user) {
                throw new UserNotFoundException();
            }

            // Hash da senha se fornecida
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);
            
            Log::info('Usuário atualizado com sucesso.', ['user_id' => $id]);
            
            return $user->fresh();
        } catch (UserNotFoundException $e) {
            throw $e;
        } catch (Exception $e) {
            Log::error('Erro ao atualizar usuário.', [
                'error' => $e->getMessage(),
                'user_id' => $id,
                'data' => $data,
            ]);
            throw new UserUpdateException('Não foi possível atualizar o usuário.', 500, $e);
        }
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }
}
