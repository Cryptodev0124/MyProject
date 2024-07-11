import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MyProject } from '../wrappers/MyProject';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MyProject', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MyProject');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let myProject: SandboxContract<MyProject>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        myProject = blockchain.openContract(MyProject.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await myProject.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myProject.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and myProject are ready to use
    });
});
