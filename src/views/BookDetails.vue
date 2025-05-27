<template>
    <div v-if="book && book.length > 0" class="grid grid-cols-2 gap-6">   
        <div>
            <img :src="book[0].imageURL" alt="">
        </div>

        <div>
            <h1>{{ book[0].title }}</h1>
            <p>{{ book[0].author }}</p>
            <p>{{ book[0].description }}</p>
            <p>Published: {{ book[0].releaseYear }}</p>
        </div>
    </div>

    <div v-else>
        Loading book details...
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBooks } from '../modules/book/useBooks';
import type { Book } from '../interfaces/book';


const route = useRoute();
const book = ref<Book[] | null>(null);

const { fetchBookById } = useBooks();

// when the html is being rendered, then collect the data
onMounted(async() => {
    const bookId = route.params.id as string;
    const fetchBook = await fetchBookById(bookId);
    console.log("Fetched book", fetchBook);
    book.value = fetchBook;
    console.log("Book: ", book.value);
})


</script>

<style scoped>

</style>