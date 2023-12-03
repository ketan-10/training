package com.ketan.training.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ketan.training.dto.training.TrainingCronDto;
import com.ketan.training.utils.cron.Scheduler;

import java.util.List;

@RestController
@RequestMapping("/api/rpc")
public class RpcController {
    @Autowired
    private Scheduler scheduler;

    @PostMapping("/triggerCron")
    public ResponseEntity<List<TrainingCronDto>> triggerCronNow() {
        List<TrainingCronDto> triggerCron = scheduler.manualTriggerCron();
        return new ResponseEntity<>(triggerCron, HttpStatus.OK);

    }

}
