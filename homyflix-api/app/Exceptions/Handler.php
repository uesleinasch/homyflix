<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($request->wantsJson()) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    private function handleApiException($request, Throwable $exception)
    {
        $exception = $this->prepareException($exception);

        $statusCode = $this->getStatusCode($exception);
        $response = $this->prepareJsonResponse($request, $exception);

        Log::error('API Exception', [
            'message' => $exception->getMessage(),
            'status_code' => $statusCode,
            'request_url' => $request->fullUrl(),
            'request_method' => $request->method(),
            'request_payload' => $request->all(),
            'exception_trace' => $exception->getTraceAsString(),
        ]);

        return $response;
    }

    private function getStatusCode(Throwable $exception)
    {
        if ($exception instanceof HttpException) {
            return $exception->getStatusCode();
        }

        if ($exception instanceof ModelNotFoundException) {
            return 404;
        }

        if ($exception instanceof AuthorizationException) {
            return 403;
        }

        if ($exception instanceof ValidationException) {
            return 422;
        }

        return 500;
    }

    protected function prepareJsonResponse($request, Throwable $exception)
    {
        $statusCode = $this->getStatusCode($exception);

        $response = [
            'success' => false,
            'message' => $this->getMessage($exception, $statusCode),
        ];

        if (config('app.debug')) {
            $response['exception'] = get_class($exception);
            $response['trace'] = $exception->getTrace();
        }

        if ($exception instanceof ValidationException) {
            $response['errors'] = $exception->errors();
        }

        return new JsonResponse($response, $statusCode);
    }

    private function getMessage(Throwable $exception, int $statusCode): string
    {
        $messages = [
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            422 => 'Unprocessable Entity',
            500 => 'Internal Server Error',
        ];

        return $messages[$statusCode] ?? $exception->getMessage() ?: 'An unexpected error occurred';
    }
}
