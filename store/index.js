import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'

const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts
            },
            addPost(state, post) {
                state.loadedPosts.push(post)
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
                state.loadedPosts[postIndex] = editedPost
            },
            setToken(state, token) {
                state.token = token
            },
            clearToken(state) {
                state.token = null
            }
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                return axios.get('https://learn-nuxt-kj.firebaseio.com/posts.json')
                .then(res => {
                    const postsArray = []
                    for (const key in res.data) {
                        postsArray.push({ ...res.data[key], id:key })
                    }
                    vuexContext.commit('setPosts', postsArray)
                })
                .catch(e => context.error(e));
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts);
            },
            addPost(vuexContext, postData) {
                const createdPost = {
                    ...postData, 
                    updatedDate: new Date()
                    }
                return axios.post('https://learn-nuxt-kj.firebaseio.com/posts.json?auth=' + vuexContext.state.token, createdPost)
                .then(res => {
                    vuexContext.commit('addPost', {...createdPost, id: res.data.name})
                    
                })
                .catch(e=> console.log(e));
                
            },
            editPost(vuexContext, editedPost) {
                return axios.put('https://learn-nuxt-kj.firebaseio.com/posts/'+editedPost.id+'.json?auth='+vuexContext.state.token, editedPost)
                .then(res => {
                    vuexContext.commit('editPost', editedPost)
                })
                .catch(e => console.log(e))
                vuexContext.commit('editPost', editedPost)
            },
            authenticateUser(vuexContext, authData) {
                let authURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.fbAPIKey
                if(!authData.isLogin) {
                    authURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.fbAPIKey 
                }
                return axios.post(authURL, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                })
                .then(res => {
                    vuexContext.commit('setToken', res.data.idToken)
                    localStorage.setItem('token', res.data.idToken)
                    localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000)
                    Cookie.set('jwt', res.data.idToken);
                    console.log(new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000)
                    Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000);
                    // vuexContext.dispatch('setLogoutTimer', res.data.expiresIn * 1000)
                })
                .catch(e => console.log(e))
            },
            // setLogoutTimer(vuexContext, duration) {
            //     setTimeout(() =>  {
            //         vuexContext.commit('clearToken')
            //     }, duration)
            // },
            initAuth(vuexContext, req) {
                let token
                let expirationDate
                
                
                
                if(req) {
                    if(!req.headers.cookie) {
                        return
                    }
                    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
                    if(!jwtCookie){
                        return
                    }
                    token = jwtCookie.split('=')[1]  
                    const jwtExpirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate='))
                    if(!jwtExpirationDate) {
                        return
                    }
                    expirationDate = jwtExpirationDate.split('=')[1]
                } else if (process.client) {
                    token = localStorage.getItem('token')
                    expirationDate = localStorage.getItem('tokenExpiration')
                } else {
                    token = null
                    expirationDate = null
                }
                if(new Date().getTime() > expirationDate || !token) {
                    vuexContext.dispatch('logout')
                    return 
                } 
                
                // vuexContext.dispatch('setLogoutTimer', +expirationDate - new Date().getTime())
                vuexContext.commit('setToken', token)
            },
            logout(vuexContext) {
                vuexContext.commit('clearToken')
                Cookie.remove('token')
                Cookie.remove('expirationDate')
                if(process.client) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('tokenExpiration')    
                }
                
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuthenticated(state) {
                return state.token != null
            }
        }
    })
}

export default createStore