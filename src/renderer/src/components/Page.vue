<script setup lang="ts">
import { ElMessage } from 'element-plus'

const { row1, row2, row3,
    row4, row5, row6,
    row7, row8, row9, row10,
    row11, row12, row13,
    row14 } = useConst()
const store = useStore()

const submit = async (cmd: string) => {
    if (!store.player_uid) {
        ElMessage.error("请先输入uid")
        return
    }
    const url = `http://127.0.0.1:1371/api/gm?player_uid=${store.player_uid}&command=${cmd}&token=${store.token}`
    let result: any
    if (window.electron) {
        result = await window.electron.ipcRenderer.invoke('api-call', url)
    } else {
        result = await (await fetch(url)).json()
    }
    ElMessage.info(result.message)
    localStorage.setItem('uid', store.player_uid)
}

onMounted(async () => {
    row1[0].arr = await store.getItemData(store.item_url) ?? []
    row4[0].arr = await Promise.all(await store.getCharacterData(store.character_url) ?? [])
    row5[0].arr = row4[0].arr
    row6[0].arr = row4[0].arr
    row7[0].arr = await store.getWeaponData(store.weapon_url) ?? []
    row8[0].arr = await store.getEquipData(store.equipment_url) ?? []
    row9[0].arr = store.skinData
    row10[0].arr = row4[0].arr
    row12[0].arr = await store.getShiyuData(store.shiyu_url) ?? []
    row13[0].arr = await store.getBossData(store.boss_url) ?? []
})
</script>

<template>
    <div class="control-group">
        <span class="control-label">Player UID:</span>
        <el-input v-model="store.player_uid" style="width: 240px" placeholder="type your uid" />
    </div>
    <Layout str="AddItem" :arr="row1" @req_cmd="submit" />
    <Layout str="SetYorozuyaLv" :arr="row2" @req_cmd="submit" />
    <Layout str="AddAllAvatar" :arr="row3" @req_cmd="submit" />
    <Layout str="AvatarLvUp" :arr="row4" @req_cmd="submit" />
    <Layout str="AvatarSkillUp" :arr="row5" @req_cmd="submit" />
    <Layout str="AvatarSkillUp" :arr="row6" @req_cmd="submit" />
    <Layout str="AddWeapon" :arr="row7" @req_cmd="submit" />
    <Layout str="AddEquip" :arr="row8" @req_cmd="submit" />
    <Layout str="SetAvatarSkin" :arr="row9" @req_cmd="submit" />
    <Layout str="SetControlGuiseAvatar" :arr="row10" @req_cmd="submit" />
    <Layout str="ClearMainCityQuestCollection" :arr="row11" @req_cmd="submit" />
    <Layout str="UnlockBossBattleQuest" :arr="row12" @req_cmd="submit" />
    <Layout str="UnlockDoubleEliteQuest" :arr="row13" @req_cmd="submit" />
    <Layout str="UnlockMonsterCardLevel" :arr="row14" @req_cmd="submit" />
</template>

<style scoped lang="scss">
.control-group {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
}

.control-label {
    white-space: nowrap;
}
</style>