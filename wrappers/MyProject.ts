import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MyProjectConfig = {};

export function myProjectConfigToCell(config: MyProjectConfig): Cell {
    return beginCell().endCell();
}

export default class MyProject implements Contract {
    static createForDeploy(code: Cell, initialCounterValue: number): MyProject {
        const data = beginCell()
            .storeUint(initialCounterValue, 64)
            .endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new MyProject(address, { code, data });
    }
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new MyProject(address);
    }

    static createFromConfig(config: MyProjectConfig, code: Cell, workchain = 0) {
        const data = myProjectConfigToCell(config);
        const init = { code, data };
        return new MyProject(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01", // send 0.01 TON to contract for rent
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    // export default class Counter implements Contract {

    async getCounter(provider: ContractProvider) {
        const { stack } = await provider.get("counter", []);
        return stack.readBigNumber();
    }

    // }

    // export default class Counter implements Contract {

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: "0.002", // send 0.002 TON for gas
            body: messageBody
        });
    }

    // }


}
