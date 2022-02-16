package com.example.studio.analyzer;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.twilio.Twilio;
import com.twilio.base.ResourceSet;
import com.twilio.rest.studio.v2.Flow;
import com.twilio.rest.studio.v2.flow.Execution;
import com.twilio.rest.studio.v2.flow.execution.ExecutionStep;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class FlowAnalyzer {

    public static final String STATES = "states";
    public static final String NAME = "name";
    public static final String TRANSITIONS = "transitions";
    public static final String NEXT = "next";
    public static final String TWILIO_ACCOUNT_SID = "TWILIO_ACCOUNT_SID";
    public static final String TWILIO_AUTH_TOKEN = "TWILIO_AUTH_TOKEN";

    static {
        var dotenv = Dotenv.configure().load();
        var accountSid = dotenv.get(TWILIO_ACCOUNT_SID);
        var authToken = dotenv.get(TWILIO_AUTH_TOKEN);
        Twilio.init(accountSid, authToken);
    }

    @Data
    @Builder
    @ToString
    @EqualsAndHashCode
    public static class FlowNode {
        private String name;
        private List<String> references;
        private int executed;
    }

    public static List<FlowNode> getEnrichedFlowNodes(String flowSid, ZonedDateTime from, ZonedDateTime to) {
        var flowNodes = getFlowNodes(flowSid);
        var executions = getWidgetExecutions(flowSid, from, to);
        flowNodes.forEach(flowNode -> flowNode.setExecuted(executions.getOrDefault(flowNode.getName(), 0)));

        return flowNodes;
    }

    public static List<FlowNode> getFlowNodes(String flowSid) {
        var flow = Flow.fetcher(flowSid).fetch();
        var definition = flow.getDefinition();
        var gson = new Gson();
        var json = gson.toJsonTree(definition).getAsJsonObject();
        var states = json.get(STATES).getAsJsonArray();
        var nodes = new ArrayList<FlowNode>();
        states.forEach(state -> {
            var stateJson = state.getAsJsonObject();
            var name = stateJson.get(NAME).getAsString();
            var transitions = stateJson.get(TRANSITIONS).getAsJsonArray();
            var references = getReferences(transitions);
            var node = FlowNode.builder()
                    .name(name)
                    .references(references)
                    .build();
            nodes.add(node);
        });

        return nodes;
    }

    private static List<String> getReferences(JsonArray transitions) {
        var references = new ArrayList<String>();
        transitions.forEach(transition -> {
            var transitionJson = transition.getAsJsonObject();
            if (transitionJson.has(NEXT)) {
                references.add(transitionJson.get(NEXT).getAsString());
            }
        });
        return references;
    }

    public static HashMap<String, Integer> getWidgetExecutions(String flowSid, ZonedDateTime from, ZonedDateTime to) {
        var executionSids = new ArrayList<String>();
        Execution.reader(flowSid)
                .setDateCreatedFrom(from)
                .setDateCreatedTo(to)
                .read()
                .forEach(record -> executionSids.add(record.getSid()));

        return calculateSteps(flowSid, executionSids);
    }

    private static HashMap<String, Integer> calculateSteps(String flowSid, List<String> executionSids) {
        var map = new HashMap<String, Integer>();
        executionSids.forEach(executionSid -> {
            ResourceSet<ExecutionStep> steps = ExecutionStep.reader(flowSid, executionSid)
                    .read();

            for (ExecutionStep record : steps) {
                var from = record.getTransitionedFrom();
                int count = map.getOrDefault(from, 0);
                map.put(from, count + 1);
            }
        });

        return map;
    }
}
