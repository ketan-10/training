package com.ketan.training.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.dashboard.DashboardCountDto;
import com.ketan.training.service.DashboardService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/count")
    public ResponseEntity<DashboardCountDto> getDashboardCount() {
        DashboardCountDto dashStatusCount = dashboardService.getDashStatusCount();
        return new ResponseEntity<>(dashStatusCount, HttpStatus.OK);
    }
}
