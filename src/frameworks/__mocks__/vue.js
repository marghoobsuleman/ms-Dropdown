// Mock Vue for tests
const Vue = {
  createApp: () => ({
    component: jest.fn(),
    mount: jest.fn(),
    use: jest.fn(),
    directive: jest.fn()
  }),
  ref: (val) => ({
    value: val,
    __v_isRef: true
  }),
  onMounted: jest.fn(),
  onBeforeUnmount: jest.fn(),
  watch: jest.fn(),
  defineComponent: (options) => options
};

export default Vue;
export const createApp = Vue.createApp;
export const ref = Vue.ref;
export const onMounted = Vue.onMounted;
export const onBeforeUnmount = Vue.onBeforeUnmount;
export const watch = Vue.watch;
export const defineComponent = Vue.defineComponent;
