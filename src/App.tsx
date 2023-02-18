import React, {useState} from 'react';
import './App.css';
import {Container, Paper, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AgentGraph from "./AgentGraph";
import {Agent, agent1, agent2, NeuronType} from "./fixtures/agent";

type Selection = {
    type: 'Connection',
    connectionId: number
} | {
    type: 'Node',
    nodeId: number
} | null

function App() {
    const [agent, setAgent] = useState<Agent | null>(agent1);
    const [selection, setSelection] = useState<Selection | null>(null);

    const setSelectedConnection = (connectionId: number | null) => setSelection(connectionId === null ? null : {
        type: 'Connection',
        connectionId: connectionId
    })
    const selectedConnection = selection?.type === 'Connection' ? selection.connectionId : null;

    const setSelectedNode = (nodeId: number | null) => setSelection(nodeId === null ? null : {
        type: 'Node',
        nodeId: nodeId
    })
    const selectedNode = selection?.type === 'Node' ? selection.nodeId : null;


    return (
        <Container component="main" maxWidth="lg">

            <Typography variant="h5" sx={{
                pt: 13
            }}>Agent design</Typography>
            <Grid2 container>
                <Grid2 xs={3}>
                    <Paper
                        sx={{
                            height: 580,
                            m: 1,
                            p: 2
                        }}>
                        <Typography variant="h5">Agents</Typography>
                        <Typography variant="body1" component={"p"} onClick={() => {
                            setAgent(agent1);
                            setSelection(null);
                        }}>Agent
                            1</Typography>
                        <Typography variant="body1" component={"p"} onClick={() => {
                            setAgent(agent2);
                            setSelection(null);
                        }}>Agent
                            2</Typography>
                    </Paper>
                </Grid2>
                <Grid2 xs={9}>
                    <Grid2 container>
                        <Grid2 xs={4}>
                            <Paper
                                sx={{
                                    height: 150,
                                    m: 1,
                                    p: 2
                                }}>
                                <Typography variant="h5">Level information</Typography>
                                <Typography variant="body1">Current level: 1</Typography>
                                <Typography variant="body1">Total agents: 5 / 7</Typography>
                            </Paper>
                        </Grid2>
                        <Grid2 xs={4}>
                            <Paper sx={{
                                height: 150,
                                m: 1,
                                p: 2
                            }}>
                                <Typography variant="h5">Agent information</Typography>
                                {agent ? <>
                                        <Typography variant="body1">Input
                                            neurons: {agent.neurons.filter(neuron => neuron.type === NeuronType.Input).length}</Typography>
                                        <Typography variant="body1">Internal
                                            neurons: {agent.neurons.filter(neuron => neuron.type === NeuronType.Intermediate).length}</Typography>
                                        <Typography variant="body1">Output
                                            neurons: {agent.neurons.filter(neuron => neuron.type === NeuronType.Output).length}</Typography>
                                    </> :
                                    <Typography variant="body1">No agent selected</Typography>}

                            </Paper>
                        </Grid2>
                        <Grid2 xs={4}>
                            <Paper sx={{
                                height: 150,
                                m: 1,
                                p: 2
                            }}>
                                <Typography variant="h5">Connection information</Typography>
                                <Typography variant="body1">Start neuron: x</Typography>
                                <Typography variant="body1">End neurons: x</Typography>
                                <Typography variant="body1">Weight: 3</Typography>
                            </Paper>
                        </Grid2>
                        <Grid2 xs={12}>
                            {agent ? <AgentGraph agent={agent}
                                                 width={820}
                                                 height={400}
                                                 selectedConnection={selectedConnection}
                                                 setSelectedConnection={setSelectedConnection}
                                                 selectedNode={selectedNode}
                                                 setSelectedNode={setSelectedNode}
                                />
                                : null}
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>

        </Container>
    );
}

export default App;
