<script lang="ts" setup>
const props = defineProps<{
    str: string;
    arr: Cfg[];
}>();

const emit = defineEmits<{
    'req_cmd': [value: string]
}>()

const selected = ref<{ select?: string; arr: Item[]; CascaderSelect?: string[] }[]>([]);

// 生成命令并复制到剪贴板
const handleGenerateCommand = () => {
    let command = props.str;

    command += props.arr.reduce((pre, cur, i) => {
        if (props.arr[i].cmdConbineFn) {
            return props.arr[i].cmdConbineFn(pre, cur, selected.value[i])
        }
        pre += ` ${selected.value[i]?.select ?? ""}`
        return pre
    }, "")

    console.log(command);
    emit('req_cmd', command)
    // window.ipcRenderer.invoke('copy-to-clipboard', command);
    // ElMessage.success({ message: "成功复制" });
};

// 过滤方法
const handleFilter = (query: string, index: number) => {
    if (!selected.value.length || !props.arr.length) return;

    if (query) {
        setTimeout(() => {
            const originalArr = props.arr[index].arr;
            selected.value[index].arr = originalArr.filter((item: Item) => {
                const queryLower = query.toLowerCase();
                return item.label.toLowerCase().includes(queryLower) ||
                    item.value.toLowerCase().includes(queryLower);
            });
        }, 200);
    } else {
        selected.value[index].arr = props.arr[index].arr;
    }
};

// 初始化选中状态
const initializeSelected = (list: Cfg[]) => {
    list.forEach((config) => {
        if (config.isCascader) {
            const firstOption = config.arr[0];
            selected.value.push({
                CascaderSelect: [
                    firstOption?.value || '',
                    firstOption?.children?.[0]?.value || ''
                ],
                arr: config.arr
            });
        } else {
            selected.value.push({
                select: config.arr[0]?.value ?? "",
                arr: config.arr
            });
        }
    });
};

// 或者使用 watchEffect
watchEffect(() => {
    if (props.arr[0].arr.length) {
        initializeSelected(props.arr);
    }
})
</script>

<template>
    <div class="layout">
        <div class="controls-wrapper">
            <div class="controls-container">
                <div v-for="(item, index) in props.arr" :key="index" class="control-group"
                    :class="{ 'control-group--break': item.isBreak }">
                    <div class="control-label">{{ item.label }}</div>

                    <div v-if="selected[index]?.arr.length" class="control-input">
                        <!-- 级联选择器 -->
                        <el-cascader v-if="item.isCascader" v-model="selected[index].CascaderSelect"
                            :options="selected[index].arr" :props="{ expandTrigger: 'hover' }"
                            :style="{ width: item.w || 'auto' }" :filterable="item?.isSearch"
                            :show-all-levels="item.isShowAllLevel" />

                        <!-- 虚拟化选择器（大数据量） -->
                        <el-select-v2 v-else-if="selected[index].arr.length > 500" v-model="selected[index].select"
                            :filterable="item?.isSearch" :style="{
                                width: item.w || 'auto',
                                minWidth: '60px'
                            }" :options="selected[index].arr"
                            :remote-method="(query: string) => handleFilter(query, index)" />

                        <!-- 普通选择器 -->
                        <el-select v-else v-model="selected[index].select" :filterable="item?.isSearch" :style="{
                            width: item.w || 'auto',
                            minWidth: '60px'
                        }" :remote-method="(query: string) => handleFilter(query, index)">
                            <el-option v-for="option in selected[index].arr" :key="option.value" :label="option.label"
                                :value="option.value" />
                        </el-select>
                    </div>
                </div>
            </div>
        </div>

        <el-button class="generate-button" type="primary" @click="handleGenerateCommand">
            提交命令
        </el-button>
    </div>
</template>

<style lang="scss" scoped>
.layout {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.controls-wrapper {
    width: 100%;
}

.controls-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 5px;

    &--break::after {
        content: '';
        flex-grow: 1;
        width: 100%;
        min-width: 350px;
        height: 0;
    }
}

.control-label {
    white-space: nowrap;
}

.control-input {
    width: auto;
}

.generate-button {
    align-self: flex-start;
    margin: 4px 0;
}
</style>