package com.ketan.training.exception;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponsePayload {
    private String message;

    private Integer status;

    private List<String> trace;

    private Date timestamp;

    private String error;

    private String path;

}
