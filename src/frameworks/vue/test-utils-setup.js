import { config } from '@vue/test-utils';
import { createApp } from 'vue';

const app = createApp({});

// Configure Vue Test Utils
config.global.plugins = [];
config.global.components = {};
config.global.directives = {};
config.global.mocks = {};

// Add any global components or directives here if needed
app.config.warnHandler = () => null;

export { app };
