export enum NeuronType {
    Input,
    Intermediate,
    Output,
}

export type Neuron = {
    id: number,
    type: NeuronType,
    name: string,
}

export type Connection = {
    id: number
    from: number; // Neuron id
    to: number; // Neuron id
    weight: number;
}

export class Agent {
    constructor(public id: number,
                public neurons: Neuron[],
                public connections: Connection[]) {
    }
}

const generateAgent = (id: number, nInputNeurons: number, nIntermediateNeurons: number, nOutputNeurons: number): Agent => {
    const inputNeurons: Neuron[] = Array.from({length: nInputNeurons}, (x, i) => i).map(i => ({
        id: 1000 + i,
        type: NeuronType.Input,
        name: `Input neuron #${i}`
    }));
    const intermediateNeurons: Neuron[] = Array.from({length: nIntermediateNeurons}, (x, i) => i).map(i => ({
        id: 2000 + i,
        type: NeuronType.Intermediate,
        name: `Intermediate neuron #${i}`
    }));
    const outputNeurons: Neuron[] = Array.from({length: nOutputNeurons}, (x, i) => i).map(i => ({
        id: 3000 + i,
        type: NeuronType.Output,
        name: `Output neuron #${i}`
    }));

    const minWeight = -100;
    const maxWeight = 100;

    const connections: Connection[] = [];

    for (let inputNeuron of inputNeurons) {
        for (let intermediateNeuron of intermediateNeurons) {
            connections.push({
                id: nInputNeurons * inputNeuron.id + intermediateNeuron.id,
                from: inputNeuron.id,
                to: intermediateNeuron.id,
                weight: Math.random() * (maxWeight - minWeight) + minWeight,
            })
        }
    }


    for (let intermediateNeuron of intermediateNeurons) {
        for (let outputNeuron of outputNeurons) {
            connections.push({
                id: nIntermediateNeurons * intermediateNeuron.id + outputNeuron.id,
                from: intermediateNeuron.id,
                to: outputNeuron.id,
                weight: Math.random() * (maxWeight - minWeight) + minWeight,
            })
        }
    }

    return new Agent(id, [
        ...inputNeurons,
        ...intermediateNeurons,
        ...outputNeurons,
    ], connections)
}


export const agent1 = generateAgent(1, 3, 5, 4);
export const agent2 = generateAgent(2, 2, 6, 4);
