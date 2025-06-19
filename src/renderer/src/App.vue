<script setup lang="ts">
onMounted(() => {
    if (window.electron) window.electron.ipcRenderer.send('renderer-loaded')
})
</script>

<template>
    <Page />
</template>
