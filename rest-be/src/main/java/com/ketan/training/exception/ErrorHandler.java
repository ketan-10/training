package com.ketan.training.exception;

import java.util.Date;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler({ CustomErrors.BadRequestException.class })
    public ResponseEntity<ErrorResponsePayload> handleCustomBadRequestException(Exception ex,
            HttpServletRequest request) {
        ErrorResponsePayload response = errorDetails(ex.getMessage(), ex, HttpStatus.BAD_REQUEST, request);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler({ CustomErrors.UnauthorizedException.class })
    public ResponseEntity<ErrorResponsePayload> handleCustomUnauthorizedException(Exception ex,
            HttpServletRequest request) {
        ErrorResponsePayload response = errorDetails(ex.getMessage(), ex, HttpStatus.UNAUTHORIZED, request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler({ CustomErrors.ValidationException.class })
    public ResponseEntity<ErrorResponsePayload> handleCustomValidationException(Exception ex,
            HttpServletRequest request) {
        ErrorResponsePayload response = errorDetails(ex.getMessage(), ex, HttpStatus.FORBIDDEN, request);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler({ CustomErrors.NotFoundException.class })
    public ResponseEntity<ErrorResponsePayload> handleCustomNotFoundException(Exception ex,
            HttpServletRequest request) {
        ErrorResponsePayload response = errorDetails(ex.getMessage(), ex, HttpStatus.NOT_FOUND, request);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler({ CustomErrors.DuplicateException.class })
    public ResponseEntity<ErrorResponsePayload> handleCustomDuplicateException(Exception ex,
            HttpServletRequest request) {
        ErrorResponsePayload response = errorDetails(ex.getMessage(), ex, HttpStatus.CONFLICT, request);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    private ErrorResponsePayload errorDetails(String message, Exception exception, HttpStatus httpStatus,
            HttpServletRequest request) {
        var errorDetail = ErrorResponsePayload.builder().message(message).status(httpStatus.value())
                .timestamp(new Date()).error(httpStatus.getReasonPhrase())
                .trace(Stream.of(exception.getStackTrace()).map(StackTraceElement::toString).toList())
                .path(request.getRequestURI().substring(request.getContextPath().length())).build();

        log.error(exception.getMessage());
        return errorDetail;
    }
}
