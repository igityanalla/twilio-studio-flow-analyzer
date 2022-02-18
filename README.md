# Twilio Studio Flow Analyzer

Twilio Studio Flow Analyzer is a tool that allows you to visualize 
the insights of your Studio flow. All you need to do 
is to provide the SID of your flow (as well as, optionally, 
the date range of executions). The output will be a graph with 
the numbers of executions for each widget. This can help you 
understand the performance of your IVR better, see which paths
your users take more, what part of executions go wrong etc.


![Studio flow visualized](/img/graph.png?raw=true)

## Requirements
For building and running this application you need:

- [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven](https://maven.apache.org)
- [Node.js](https://nodejs.org/en/download/)

## How To Use

1. `cp .env.example .env`
2. Add your Twilio Account SID and Auth Token in `.env`
3. `mvn spring-boot:run`
4. `cd frontend`
5. `npm install`
6. `npm start`
7. Head over to http://localhost:3000/ and start analyzing!

![Studio Analyzer](/img/form.png?raw=true)
