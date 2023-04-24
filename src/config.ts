const CONTRACT_DEPLOYER = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9';
const API_HOST = 'https://stacks-node-api.alexlab.co';
const IS_MAINNET = true;

export const configs = {
  IS_MAINNET,
  CONTRACT_DEPLOYER,
  API_HOST,
};

export type AlexConfig = typeof configs;

export function assignConfig(newConfigs: Partial<AlexConfig>) {
  Object.assign(configs, newConfigs);
}
