<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
export default {
  name: 'About',
  components: {
    Footer
  },
  data() {
    return {
      // active: null
    }
  }
}
</script>