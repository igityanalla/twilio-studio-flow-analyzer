import './App.css';
import React, {useState} from 'react';
import Graph from "react-graph-vis";
import DatePicker from "react-datepicker";
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner';

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";

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

    const handleFromDate = (date) => {
        setFromDate(date);
    };

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
                let graph = createGraph(data);
                setGraph(graph);
                setShowSpinner(false);
                setShowGraph(true);
            });

    }

    function createGraph(data) {
        const edges = [];
        const nodes = data.map(element => {
            const {name, executed, references} = element;
            const node = {
                id: name,
                label: name + '\n' + executed,
            }
            references.forEach(ref => {
                const edge = {
                    from: name,
                    to: ref,
                };
                edges.push(edge);
            })
            return node;
        });
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
                    />
                </div>}
            </div>

        </div>
    );
}

export default App;
