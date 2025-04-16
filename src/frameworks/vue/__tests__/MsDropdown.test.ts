import { mount } from '@vue/test-utils';
import MsDropdown from '../MsDropdown.vue';
import { nextTick } from 'vue';

// Mock the base MsDropdown class
const mockDestroy = jest.fn();
const mockRefresh = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../../../js/lib/dd', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((element, settings) => {
      return {
        element,
        settings,
        destroy: mockDestroy,
        refresh: mockRefresh,
        set value(val) {
          mockSetValue(val);
        },
        get value() {
          return 'mocked-value';
        }
      };
    })
  };
});

describe('MsDropdown Vue Component TypeScript Tests', () => {
  beforeEach(() => {
    mockDestroy.mockClear();
    mockRefresh.mockClear();
    mockSetValue.mockClear();
  });

  test('renders properly with default props', async () => {
    const wrapper = mount(MsDropdown);
    await nextTick();
    
    expect(wrapper.find('select').exists()).toBe(true);
  });

  test('passes options as props', async () => {
    const options = [
      { text: 'Facebook', value: 'fb', image: 'fb.gif' },
      { text: 'Twitter', value: 'tw', image: 'tw.gif' }
    ];
    
    const wrapper = mount(MsDropdown, {
      props: {
        options
      }
    });
    await nextTick();
    
    const optionElements = wrapper.findAll('option');
    expect(optionElements.length).toBe(options.length);
    
    options.forEach((option, index) => {
      expect(optionElements[index].text()).toBe(option.text);
      expect(optionElements[index].attributes('value')).toBe(option.value);
      expect(optionElements[index].attributes('data-image')).toBe(option.image);
    });
  });

  test('renders with v-model prop', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        modelValue: 'tw',
        options: [
          { text: 'Facebook', value: 'fb' },
          { text: 'Twitter', value: 'tw' }
        ]
      }
    });
    await nextTick();
    
    // Just verify the component renders with the prop
    expect(wrapper.find('select').exists()).toBe(true);
  });

  test('emits update:modelValue event on change', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        options: [
          { text: 'Facebook', value: 'fb' },
          { text: 'Twitter', value: 'tw' }
        ]
      }
    });
    await nextTick();
    
    // Simulate a change event
    wrapper.find('select').trigger('change');
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
  });

  test('applies custom class', async () => {
    const customClass = 'custom-dropdown';
    const wrapper = mount(MsDropdown, {
      props: {
        class: customClass
      }
    });
    await nextTick();
    
    expect(wrapper.find('select').classes()).toContain(customClass);
  });

  test('handles multiple selection', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        multiple: true,
        options: [
          { text: 'JavaScript', value: 'js' },
          { text: 'TypeScript', value: 'ts' },
          { text: 'Python', value: 'py' }
        ]
      }
    });
    await nextTick();
    
    expect(wrapper.find('select').attributes('multiple')).toBeDefined();
  });

  test('accepts imagePosition prop', async () => {
    const wrapper = mount(MsDropdown, {
      props: {
        imagePosition: 'right'
      }
    });
    await nextTick();
    
    // Just verify the component renders with the prop
    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.props('imagePosition')).toBe('right');
  });

  test('destroys MsDropdown instance on unmount', async () => {
    const wrapper = mount(MsDropdown);
    await nextTick();
    
    wrapper.unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
