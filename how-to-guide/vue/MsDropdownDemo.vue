<template>
  <div class="ms-dropdown-demo">
    <h1>ms-Dropdown Vue Example</h1>
    
    <div class="example-section">
      <h2>Basic Example</h2>
      <div class="demo-container">
        <ms-dropdown
          v-model="selected"
          :options="options"
          @update:modelValue="handleChange"
        />
        <p>Selected value: {{ selected }}</p>
      </div>
    </div>
    
    <div class="example-section">
      <h2>Multiple Selection</h2>
      <div class="demo-container">
        <ms-dropdown
          v-model="multiSelected"
          :options="languages"
          multiple
          :enableCheckbox="true"
          showFilterAlways
        />
        <p>Selected values: {{ multiSelected }}</p>
      </div>
    </div>
    
    <div class="example-section">
      <h2>Custom Styling</h2>
      <div class="demo-container">
        <ms-dropdown
          v-model="themeSelected"
          :options="themes"
          imagePosition="right"
          class="custom-dropdown"
        />
      </div>
    </div>
    
    <div class="example-section">
      <h2>Dynamic Options</h2>
      <div class="demo-container">
        <ms-dropdown
          v-model="fruitSelected"
          :options="fruits"
        />
        <button @click="addFruit">Add New Fruit</button>
      </div>
    </div>
  </div>
</template>

<script>
import MsDropdown from '../../src/frameworks/vue/MsDropdown.vue';

export default {
  components: {
    MsDropdown
  },
  data() {
    return {
      // Basic example
      selected: '',
      options: [
        { text: 'Facebook', value: 'fb', image: '../../dist/images/icons/icon_email.gif' },
        { text: 'Twitter', value: 'tw', image: '../../dist/images/icons/icon_faq.gif' },
        { text: 'LinkedIn', value: 'li', image: '../../dist/images/icons/icon_games.gif' }
      ],
      
      // Multiple selection example
      multiSelected: [],
      languages: [
        { text: 'JavaScript', value: 'js', image: '../../dist/images/icons/icon_home.gif' },
        { text: 'TypeScript', value: 'ts', image: '../../dist/images/icons/icon_cart.gif' },
        { text: 'Python', value: 'py', image: '../../dist/images/icons/icon_search.gif' },
        { text: 'Ruby', value: 'rb', image: '../../dist/images/icons/icon_print.gif' }
      ],
      
      // Custom styling example
      themeSelected: 'light',
      themes: [
        { text: 'Light Theme', value: 'light', image: '../../dist/images/icons/icon_home.gif' },
        { text: 'Dark Theme', value: 'dark', image: '../../dist/images/icons/icon_cart.gif' },
        { text: 'Blue Theme', value: 'blue', image: '../../dist/images/icons/icon_search.gif' }
      ],
      
      // Dynamic options example
      fruitSelected: 'apple',
      fruits: [
        { text: 'Apple', value: 'apple', image: '../../dist/images/icons/icon_home.gif' },
        { text: 'Orange', value: 'orange', image: '../../dist/images/icons/icon_cart.gif' }
      ]
    };
  },
  methods: {
    handleChange(value) {
      console.log('Selected:', value);
    },
    addFruit() {
      this.fruits.push({
        text: 'Banana',
        value: 'banana',
        image: '../../dist/images/icons/icon_search.gif'
      });
    }
  }
};
</script>

<script setup>
// You can also use script setup syntax for Composition API
// import { ref, reactive } from 'vue';
// import MsDropdown from '../../src/frameworks/vue/MsDropdown.vue';
// 
// const selected = ref('');
// const options = reactive([
//   { text: 'Facebook', value: 'fb', image: '../../dist/images/icons/icon_email.gif' },
//   { text: 'Twitter', value: 'tw', image: '../../dist/images/icons/icon_faq.gif' },
//   { text: 'LinkedIn', value: 'li', image: '../../dist/images/icons/icon_games.gif' }
// ]);
// 
// const handleChange = (value) => {
//   console.log('Selected:', value);
// };
</script>

<style scoped>
.ms-dropdown-demo {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}

h1, h2 {
  color: #333;
}

.demo-container {
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px 0;
}

button:hover {
  background-color: #45a049;
}

.custom-dropdown {
  border: 2px solid #3498db;
  border-radius: 8px;
}
</style>
