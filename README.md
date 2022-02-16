# Twilio Studio Flow Analyzer

Twilio Studio Flow Analyzer is a tool that allows you to visualize 
the insights of your Studio flow. All you need to do 
is to provide the SID of your flow (as well as, optionally, 
the date range of executions). The output will be a graph with 
the numbers of executions for each widgets. This can help you 
understand the performance of your IVR better, see which paths
your users take, what part of executions go wrong etc.


![Studio flow visualized](/img/graph.png?raw=true)



## How To Use

1. `git clone`
2. `cp .env.example .env`
3. Add your Twilio Account SID and Auth Token in `.env`
4. `mvn spring-boot:run`
5. `cd frontend`
6. `npm install`
7. `npm start`
8. Head over to http://localhost:3000/ and start analyzing!

![Studio Analyzer](/img/form.png?raw=true)
