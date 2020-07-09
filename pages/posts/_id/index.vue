<template>
    <div class="single-post-page">
        <section class="post">
            <h1 class="post-title">{{ loadedPost.title }}</h1>
            <div class="post-details">
                <div class="post-detail">Last updated on {{ loadedPost.updatedDate }}</div>
                <div class="post-detail">Written by {{ loadedPost.author }}</div>
            </div>
            <p class="post-content">{{ loadedPost.content }}</p>
        </section>
        <section class="post-feedback">
            <p>Let me know what you think about the post, send a mail to <a href="mailto:kabeerjain@gmail.com">kabeerjain@gmail.com</a></p>
        </section>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  asyncData(context) {
    if(context.payload) {
      return {
        loadedPost: context.payload.postData
      }
    }
    return axios.get('https://learn-nuxt-kj.firebaseio.com/posts/'+context.params.id+'.json')
    .then(res => {
      console.log(res.data)
      return {
        loadedPost: res.data
      }
    })
    .catch(e => context.error(e))
  }
  // async asyncData (context) {
  //   await new Promise (resolve => setTimeout(() => resolve(), 1000))
  //   return {
  //     loadedPost : {
  //       id: '1',
  //       title: 'First post (ID:'+context.params.id + ')',
  //       previewText: 'This is first post',
  //       author: 'Kabeer',
  //       updatedDate: new Date(),
  //       content: 'Some dummy text which is definitely not the preview text',
  //       thumbnail: 'https://www.mockrabbit.com/wp-content/uploads/2018/12/Become-a-Full-Stack-Developers.jpg'
  //     }
  //   }
  // }
}
</script>

<style scoped>
.single-post-page {
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.post {
  width: 100%;
}

@media (min-width: 768px) {
  .post {
    width: 600px;
    margin: auto;
  }
}

.post-title {
  margin: 0;
}

.post-details {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 3px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .post-details {
    flex-direction: row;
  }
}

.post-detail {
  color: rgb(88, 88, 88);
  margin: 0 10px;
}

.post-feedback a {
  color: red;
  text-decoration: none;
}

.post-feedback a:hover,
.post-feedback a:active {
  color: salmon;
}
</style>