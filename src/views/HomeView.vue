<template>
  <div>
    <h1>Browse books</h1>
    <div v-if="loading" class="text-center">Loading...</div>                                           <!-- Loading wait screen with v-if -->

    <div v-else-if="error" class="text-center text-red-500">There's an error.</div> 

    <div v-else class="grid grid-cols-3 gap-6">
      <div v-for="book in books" :key="book._id">
        <router-link :to="`/books/${book._id}`">
          <img :src="book.imageURL" alt="book image" class="w-full h-auto object-cover">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBooks } from '../modules/book/useBooks'

const { loading, error, books, fetchBooks } = useBooks();

onMounted(() => {
  fetchBooks();
})

</script>

<style scoped>

</style>
