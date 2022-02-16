import './App.css';
import React, {useState} from 'react';
import Graph from "react-graph-vis";
import DatePicker from "react-datepicker";
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner';

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";

// import "./styles.css";
// // need to import the vis network css in order to show tooltip
// import "./network.css";

const baseUrl = "http://localhost"
const serverPort = 8080;


function App() {
    const options = {
        layout: {
            hierarchical: true
        },
        height: "1000px"
    };

    const [sid, setSid] = useState('');
    const [showGraph, setShowGraph] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [graph, setGraph] = useState({});
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    // define handler change function on check-in date
    const handleFromDate = (date) => {
        setFromDate(date);
    };

    // define handler change function on check-out date
    const handleToDate = (date) => {
        setToDate(date);
    };

    async function visualizeFlow() {
        setShowGraph(false);
        setShowSpinner(true);
        let from = fromDate !== null ? moment(fromDate).toISOString() : '';
        let to = toDate !== null ? moment(toDate).toISOString() : '';

        let url = `${baseUrl}:${serverPort}/flow/${sid}?from=${from}&to=${to}`;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                let graph = createGraph(data);
                setGraph(graph);
                setShowSpinner(false);
                setShowGraph(true);
            });

    }

    function createGraph(data) {
        let nodes = [];
        let edges = [];
        data.map(element => {
            let node = {};
            let name = element.name;
            node["id"] = name;
            node["label"] = name + "\n" + element.executed;
            element.references.forEach(ref => {
                let edge = {};
                edge["from"] = name;
                edge["to"] = ref;
                edges.push(edge);
            })
            nodes.push(node)
            return node;
        });
        console.log(nodes);
        console.log(edges);
        graph["nodes"] = nodes;
        graph["edges"] = edges;
        return {nodes: nodes, edges: edges};
    }

    return (
        <div>
            <div className="App">
                <label>
                    Input your Flow SID here
                    <text style={{color: 'red'}}>*</text>
                    :&nbsp;
                    <input type="text" name="flowSid" onChange={(e) => {
                        setSid(e.target.value);
                    }}/>
                </label>
                <br/>
                <br/>
                <div className="input-container">
                    <div>
                        <label>From</label>
                        <DatePicker
                            selected={fromDate}
                            onChange={handleFromDate}
                            showTimeSelect
                            dateFormat="dd/MM/yyyy HH:mm"
                        />
                    </div>
                    <div>
                        <label>To</label>
                        <DatePicker
                            selected={toDate}
                            onChange={handleToDate}
                            showTimeSelect
                            dateFormat="dd/MM/yyyy HH:mm"
                        />
                    </div>
                </div>

                <i>Please choose a date range of no more than 30 days.</i>
                <br/>
                <br/>
                <button onClick={visualizeFlow}>Visualize</button>
                {showSpinner && <div><br/><Spinner animation="border" variant="primary"/></div>}
                {showGraph && <div>
                    <Graph
                        graph={graph}
                        options={options}
                        // events={events}
                        // getNetwork={network => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                    />
                </div>}
            </div>

        </div>
    );
}

export default App;
