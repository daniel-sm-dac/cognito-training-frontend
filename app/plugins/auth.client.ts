export default defineNuxtPlugin(async () => {
    const { restorePersistedSession } = useAuth()
    await restorePersistedSession()
})