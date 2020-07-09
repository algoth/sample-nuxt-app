export default function(context) {
    console.log('[middleware] Just auth')
    if(!context.store.getters.isAuthenticated) {
        context.redirect('/admin/auth')
    }
}