import { toNano } from '@ton/core';
import { MyProject } from '../wrappers/MyProject';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myProject = provider.open(MyProject.createFromConfig({}, await compile('MyProject')));

    await myProject.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(myProject.address);

    // run methods on `myProject`
}
