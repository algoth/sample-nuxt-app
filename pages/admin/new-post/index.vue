<template>
    <div class="admin-new-post-page">
        <section class="new-post-form">
            <AdminPostForm @submit="onSubmitted"/>
           
        </section>
    </div>
</template>

<script>
import axios from 'axios'
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
    layout: 'admin',
    middleware: ['check-auth','auth'],
    components: {
        AdminPostForm
    },
    methods: {
      onSubmitted(postData) {
        this.$store.dispatch('addPost', postData).then(() => {
          this.$router.push('/admin');
        });
        // axios.post('https://learn-nuxt-kj.firebaseio.com/posts.json', {
        //   ...postData, 
        //   updatedDate: new Date()
        //   })
        // .then(result => {
        //     this.$router.push('/admin');
        // })
        // .catch(e=> console.log(e));
      }
    }
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>