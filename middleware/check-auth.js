export default function(context) {
    // console.log('[middleware] check-auth2')
    context.store.dispatch('initAuth', context.req)
}