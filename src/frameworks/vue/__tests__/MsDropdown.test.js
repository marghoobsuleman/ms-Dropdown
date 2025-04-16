import { mount } from '@vue/test-utils';
import MsDropdown from '../MsDropdown.vue';
import { nextTick } from 'vue';

// Mock the base MsDropdown class
const mockDestroy = jest.fn();
const mockRefresh = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../../js/lib/dd', () => ({
  __esModule: true,
  default: class MockMsDropdown {
    constructor(element, settings) {
      this.element = element;
      this.settings = settings;
      this.destroy = mockDestroy;
      this.refresh = mockRefresh;
      this._value = '';
    }

    set value(val) {
      this._value = val;
      mockSetValue(val);
    }

    get value() {
      return this._value;
    }
  }
}));

describe('MsDropdown Vue Component', () => {
  const defaultProps = {
    options: [
      { text: 'Facebook', value: 'fb', image: 'fb.gif' },
      { text: 'Twitter', value: 'tw', image: 'tw.gif' }
    ],
    name: 'social'
  };

  beforeEach(() => {
    mockDestroy.mockClear();
    mockRefresh.mockClear();
    mockSetValue.mockClear();
  });

  it('renders without crashing', () => {
    const wrapper = mount(MsDropdown, {
      props: defaultProps
    });
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('renders all options correctly', () => {
    const wrapper = mount(MsDropdown, {
      props: defaultProps
    });
    const options = wrapper.findAll('option');
    expect(options).toHaveLength(defaultProps.options.length);
    options.forEach((option, index) => {
      expect(option.attributes('value')).toBe(defaultProps.options[index].value);
      expect(option.text()).toBe(defaultProps.options[index].text);
      expect(option.attributes('data-image')).toBe(defaultProps.options[index].image);
    });
  });

  it('handles v-model correctly', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        modelValue: 'fb'
      }
    });
    
    await nextTick();
    expect(wrapper.find('select').element.value).toBe('fb');
    
    await wrapper.find('select').setValue('tw');
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['tw']);
  });

  it('emits change event', async () => {
    const wrapper = mount(MsDropdown, {
      props: defaultProps
    });
    
    await wrapper.find('select').setValue('tw');
    expect(wrapper.emitted().change).toBeTruthy();
  });

  it('respects disabled prop', () => {
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        disabled: true
      }
    });
    expect(wrapper.find('select').element.disabled).toBe(true);
  });

  it('handles multiple selection', () => {
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        multiple: true
      }
    });
    expect(wrapper.find('select').element.multiple).toBe(true);
  });

  it('applies custom className', () => {
    const className = 'custom-class';
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        className
      }
    });
    expect(wrapper.find('select').classes()).toContain(className);
  });

  it('handles required attribute', () => {
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        required: true
      }
    });
    expect(wrapper.find('select').element.required).toBe(true);
  });

  it('cleans up on unmount', async () => {
    const wrapper = mount(MsDropdown, {
      props: defaultProps
    });
    
    await nextTick();
    wrapper.unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('watches modelValue changes', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        ...defaultProps,
        modelValue: 'fb'
      }
    });

    await nextTick();
    await wrapper.setProps({ modelValue: 'tw' });
    expect(mockSetValue).toHaveBeenCalledWith('tw');
  });
});
