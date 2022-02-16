package com.example.studio.controller;

import com.example.studio.analyzer.FlowAnalyzer;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/flow")
@CrossOrigin
public class StudioFlowController {

    @GetMapping("/{sid}")
    public List<FlowAnalyzer.FlowNode> getFlowAnalysis(@PathVariable String sid, @RequestParam String from, @RequestParam String to) {
        if (StringUtils.hasText(from) && StringUtils.hasText(to)) {
            var fromDate = ZonedDateTime.parse(from);
            var toDate = ZonedDateTime.parse(to);
            return FlowAnalyzer.getEnrichedFlowNodes(sid, fromDate, toDate);
        }
        return FlowAnalyzer.getEnrichedFlowNodes(sid, null, null);
    }
}
