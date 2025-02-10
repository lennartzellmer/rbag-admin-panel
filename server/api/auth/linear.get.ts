export default defineOAuthLinearEventHandler({
  async onSuccess(event, { user }) {
    console.log(event)

    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  }
})
