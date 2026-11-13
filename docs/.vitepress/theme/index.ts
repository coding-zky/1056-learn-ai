import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoBlock', DemoBlock)
  },
}
