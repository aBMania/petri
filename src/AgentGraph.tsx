import React from 'react';
import './App.css';
import {Paper} from "@mui/material";
import {Group} from '@visx/group';
import {Graph} from "@visx/network";
import {Graph as GraphType, LinkProvidedProps, NodeProvidedProps} from "@visx/network/lib/types";
import {Agent, NeuronType} from "./fixtures/agent";

export type AgentEditProps = {
    agent: Agent
    width: number;
    height: number;
    selectedConnection: number | null;
    setSelectedConnection: (connection: number | null) => void
    selectedNode: number | null;
    setSelectedNode: (connection: number | null) => void
}

export type GraphNode = {
    nodeId: number;
    x: number;
    y: number;
} & React.SVGProps<SVGCircleElement>;

type Link = {
    fromNode: GraphNode;
    toNode: GraphNode;
} & React.SVGProps<SVGLineElement>;


// const link: HierarchyLink = {
//     source: {
//
//     },
//     target: {}
// };


function Node(props: NodeProvidedProps<GraphNode>) {
    const {node} = props;
    const {nodeId, ...rest} = node;
    return <circle r={15} fill={'#21D4FD'} {...rest} />
}

function LinkComponent(props: LinkProvidedProps<Link>) {
    const {link} = props;
    const {fromNode, toNode, onClick, ...rest} = link;

    return <>
        <line
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            {...rest}
        />
        {/* Bigger line for hitbox */}
        <line
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke={rest.stroke}
            strokeOpacity={0}
            strokeWidth={typeof link.strokeWidth === 'number' ? Math.max(10, link.strokeWidth) : 10}
            onClick={onClick}
        ></line>
    </>
}

type AgentToGraphParams = {
    agent: Agent,
    width: number,
    height: number,
    selectedConnection: number | null,
    setSelectedConnection: (connection: number | null) => void,
    selectedNode: number | null,
    setSelectedNode: (connection: number | null) => void
}
const agentToGraph = (params: AgentToGraphParams): GraphType<Link, GraphNode> => {

    const {
        agent,
        width,
        height,
        selectedConnection,
        setSelectedConnection,
        selectedNode,
        setSelectedNode,
    } = params;

    const marginTopBottom = height * .1;
    const marginRightLeft = width * .15;

    const remainingWidth = width - marginRightLeft * 2;
    const remainingHeight = height - marginTopBottom * 2;

    const inputNodes = agent.neurons.filter(neuron => neuron.type === NeuronType.Input)
    const intermediateNodes = agent.neurons.filter(neuron => neuron.type === NeuronType.Intermediate)
    const outputNodes = agent.neurons.filter(neuron => neuron.type === NeuronType.Output)


    const verticalInputNodesSpacing = remainingHeight / inputNodes.length
    const verticalIntermediateNodesSpacing = remainingHeight / intermediateNodes.length
    const verticalOutputNodesSpacing = remainingHeight / outputNodes.length

    const horizontalSpacing = remainingWidth / 2;

    const actualSelectedConnection = agent.connections.find(connection => connection.id === selectedConnection);
    const highlightedNodeIds = [
        selectedNode,
        actualSelectedConnection?.from,
        actualSelectedConnection?.to,
    ]

    const nodes: GraphNode[] = [
        ...inputNodes.map((inputNode, i) => ({
            nodeId: inputNode.id,
            x: marginRightLeft,
            y: verticalInputNodesSpacing * (i + .5) + marginTopBottom,
            opacity: (highlightedNodeIds.includes(inputNode.id)) ? 1 : 0.5,
            onClick: () => setSelectedNode(inputNode.id)
        })),
        ...intermediateNodes.map((inputNode, i) => ({
            nodeId: inputNode.id,
            x: marginRightLeft + horizontalSpacing,
            y: verticalIntermediateNodesSpacing * (i + .5) + marginTopBottom,
            opacity: (highlightedNodeIds.includes(inputNode.id)) ? 1 : 0.5,
            onClick: () => setSelectedNode(inputNode.id)
        })),
        ...outputNodes.map((inputNode, i) => ({
            nodeId: inputNode.id,
            x: marginRightLeft + horizontalSpacing * 2,
            y: verticalOutputNodesSpacing * (i + .5) + marginTopBottom,
            opacity: (highlightedNodeIds.includes(inputNode.id)) ? 1 : 0.5,
            onClick: () => setSelectedNode(inputNode.id)
        })),
    ];

    return {
        nodes,
        links: agent.connections.map(connection => {
            const highlighted = (selectedConnection === null && selectedNode === null)
                || selectedConnection === connection.id
                || [connection.from, connection.to].includes(selectedNode!);

            return {
                fromNode: nodes.find(({nodeId}) => nodeId === connection.from)!,
                toNode: nodes.find(({nodeId}) => nodeId === connection.to)!,
                stroke: connection.weight < 0 ? 'red' : 'green',
                strokeWidth: Math.abs(connection.weight) / 10,
                strokeOpacity: highlighted ? 0.6 : 0.3,
                onClick: () => setSelectedConnection(connection.id)
            }
        }),
    };
};

function AgentGraph(props: AgentEditProps) {
    const {
        width, height, agent, selectedConnection, setSelectedConnection,
        selectedNode,
        setSelectedNode
    } = props;

    const graph = agentToGraph({
        agent,
        width,
        height,
        selectedConnection: selectedConnection,
        setSelectedConnection: setSelectedConnection,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode
    });

    return (
        <Paper sx={{
            height: height,
            m: 1,
            p: 1
        }}>
            <svg width={width} height={height}>
                <rect width={width} height={height} rx={14} fill="#272b4d" onClick={() => {
                    setSelectedConnection(null);
                    setSelectedNode(null)
                }
                }/>
                <Group
                    top={500}
                    left={500}>
                    <circle
                        r={32}
                        fill="blue"
                    />
                </Group>
                <Graph<Link, GraphNode>
                    graph={graph}
                    linkComponent={LinkComponent}
                    nodeComponent={Node}/>
            </svg>
        </Paper>

    );
}

export default AgentGraph;
