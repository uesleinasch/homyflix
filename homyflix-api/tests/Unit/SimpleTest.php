<?php

namespace Tests\Unit;

use Tests\TestCase;

class SimpleTest extends TestCase
{
    /**
     * Teste básico para validar o ambiente PHPUnit
     *
     * test_
     */
    public function test_can_run_basic_assertions(): void
    {
        // Arrange
        $expected = 'Hello World';
        $actual = 'Hello World';

        // Act & Assert
        $this->assertEquals($expected, $actual);
        $this->assertTrue(true);
        $this->assertFalse(false);
        $this->assertIsString($expected);
        $this->assertNotEmpty($actual);
    }

    /**
     * Teste de matemática simples
     *
     * test_
     */
    public function test_can_perform_math_operations(): void
    {
        // Arrange
        $a = 5;
        $b = 3;

        // Act
        $sum = $a + $b;
        $multiply = $a * $b;

        // Assert
        $this->assertEquals(8, $sum);
        $this->assertEquals(15, $multiply);
        $this->assertGreaterThan($b, $a);
    }

    /**
     * Teste de arrays
     *
     * test_
     */
    public function test_can_work_with_arrays(): void
    {
        // Arrange
        $array = ['apple', 'banana', 'orange'];

        // Assert
        $this->assertIsArray($array);
        $this->assertCount(3, $array);
        $this->assertContains('banana', $array);
        $this->assertNotContains('grape', $array);
    }

    /**
     * Teste de validação de classe mock
     *
     * test_
     */
    public function test_can_create_mock_objects(): void
    {
        // Arrange - Criar um mock de uma classe simples
        $mockUser = $this->createMock(\stdClass::class);
        $mockUser->name = 'João Silva';
        $mockUser->email = 'joao@example.com';

        // Assert
        $this->assertInstanceOf(\stdClass::class, $mockUser);
        $this->assertEquals('João Silva', $mockUser->name);
        $this->assertEquals('joao@example.com', $mockUser->email);
    }

    /**
     * Teste de validação de environment
     *
     * test_
     */
    public function test_runs_in_testing_environment(): void
    {
        // Assert que estamos no ambiente de teste
        $this->assertEquals('testing', app()->environment());
        $this->assertTrue(app()->environment('testing'));
    }

    /**
     * Teste de configuração do Laravel
     *
     * test_
     */
    public function test_has_correct_test_configuration(): void
    {
        $this->assertEquals('array', config('cache.default'));
        $this->assertEquals('array', config('session.driver'));
        $this->assertEquals('sync', config('queue.default'));
        $this->assertEquals('array', config('mail.default'));
    }

    /**
     * Teste de data e tempo
     *
     * test_
     */
    public function test_can_work_with_dates(): void
    {
        // Arrange
        $date = now();
        $tomorrow = now()->addDay();
        $yesterday = now()->subDay();

        // Assert
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $date);
        $this->assertTrue($tomorrow->isAfter($date));
        $this->assertTrue($yesterday->isBefore($date));
    }

    /**
     * Teste de strings e manipulação
     *
     * test_
     */
    public function test_can_manipulate_strings(): void
    {
        // Arrange
        $string = 'HomyFlix Movie System';
        
        // Act & Assert
        $this->assertTrue(str_contains($string, 'Movie'));
        $this->assertTrue(str_starts_with($string, 'HomyFlix'));
        $this->assertTrue(str_ends_with($string, 'System'));
        $this->assertEquals('homyflix movie system', strtolower($string));
        $this->assertEquals(21, strlen($string));
    }

    /**
     * Teste de exceptions
     *
     * test_
     */
    public function test_can_handle_exceptions(): void
    {
        // Assert que uma exception é lançada
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Valor inválido');

        // Act - Lançar a exception
        throw new \InvalidArgumentException('Valor inválido');
    }

    /**
     * Teste de validação de tipos
     *
     * test_
     */
    public function test_can_validate_types(): void
    {
        // Arrange
        $integer = 42;
        $float = 3.14;
        $string = 'test';
        $boolean = true;
        $array = [];
        $object = new \stdClass();

        // Assert
        $this->assertIsInt($integer);
        $this->assertIsFloat($float);
        $this->assertIsString($string);
        $this->assertIsBool($boolean);
        $this->assertIsArray($array);
        $this->assertIsObject($object);
    }
} 