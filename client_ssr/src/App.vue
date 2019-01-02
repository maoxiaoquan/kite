<template>
  <div>
    <router-view/>
    <router-link :to="{ name: 'A' }" v-text="'to A'"/>
    <router-link :to="{ name: 'B' }" v-text="'to B'"/>
    <div class="store-example">
      <h1>h2</h1>
      <button @click="update">updateCount</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    update () {
      /* eslint-disable */
      alert('hi')
    }
  }
}
</script>
