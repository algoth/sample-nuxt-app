<template>
    <div class="admin-post-page">
        <section class="update-form">
            <AdminPostForm :post="loadedPost" @submit="onSubmitted"/>
        </section>
    </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
import axios from 'axios'

export default {
    layout: 'admin',
    middleware: ['check-auth','auth'],
    components: {
        AdminPostForm
    },
    // data() {
    //     return {
    //         loadedPost: {
    //             author: 'Kabeer',
    //             title: 'My Awesome Post',
    //             content: 'Super amazing, thanks for that!',
    //             thumbnailLink: 'https://www.mockrabbit.com/wp-content/uploads/2018/12/Become-a-Full-Stack-Developers.jpg'
    //         }
    //     }
    // },
    asyncData(context) {
    return axios.get('https://learn-nuxt-kj.firebaseio.com/posts/'+context.params.postId+'.json')
    .then(res => {
      console.log(res.data)
      return {
        loadedPost: {...res.data, id: context.params.postId}
      }
    })
    .catch(e => context.error(e))
    },
    methods: {
        onSubmitted(editedPost) {
            this.$store.dispatch('editPost', editedPost).then(()=> {
              this.$router.push('/admin');
            });
            
        }
    }

}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>