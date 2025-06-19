import { ElMessage } from 'element-plus'

interface State {
    player_uid: string
    token: string
    item_url: string
    character_url: string
    skin_url: string
    weapon_url: string
    equipment_url: string
    monster_url: string
    boss_url: string
    shiyu_url: string
    skinData: Item[]
    loading: Record<string, boolean>
}

// 工具函数
const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>/g, '')
}

// 通用的 fetch 函数
const fetchData = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
}

// 延迟函数用于防抖
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useStore = defineStore('main', {
    state: (): State => ({
        player_uid: localStorage.getItem('uid') ?? '',
        token: '7772774430813888210',
        item_url: 'https://api.hakush.in/zzz/data/zh/item.json',
        character_url: 'https://api.hakush.in/zzz/data/character.json',
        skin_url: 'https://api.hakush.in/zzz/data/zh/character/',
        weapon_url: 'https://api.hakush.in/zzz/data/weapon.json',
        equipment_url: 'https://api.hakush.in/zzz/data/equipment.json',
        monster_url: 'https://api.hakush.in/zzz/data/monster.json',
        boss_url: 'https://api.hakush.in/zzz/data/boss.json',
        shiyu_url: 'https://api.hakush.in/zzz/data/shiyu.json',
        skinData: [],
        loading: {}
    }),

    getters: {
        isLoading: (state) => (key: string) => state.loading[key] || false
    },

    actions: {
        setLoading(key: string, isLoading: boolean) {
            this.loading[key] = isLoading
        },
        handleError(error: unknown, context: string) {
            console.error(`Error in ${context}:`, error)
            const errorMessage = error instanceof Error ? error.message : String(error)
            ElMessage.error({ message: `${context} 获取失败: ${errorMessage}` })
            return null
        },
        async handleRequest<T>(
            key: string,
            requestFn: () => Promise<T>,
            delayMs: number = 300
        ): Promise<T | null> {
            if (this.isLoading(key)) {
                return null
            }

            try {
                this.setLoading(key, true)

                if (delayMs > 0) {
                    await delay(delayMs)
                }

                const result = await requestFn()
                return result
            } catch (error) {
                return this.handleError(error, key)
            } finally {
                this.setLoading(key, false)
            }
        },
        async getItemData(url: string): Promise<Item[] | null> {
            return this.handleRequest('item', async () => {
                return await this.processItemDataInWorker(url)
            })
        },
        async processItemDataInWorker(url: string): Promise<Item[]> {
            return new Promise((resolve, reject) => {
                // // 分离worker的写法
                // import('../worker/item-worker2.ts?worker')
                //     .then(({ default: WorkerClass }) => {
                //         let isCompleted = false
                //         const worker = new WorkerClass()

                //         worker.onmessage = (event: MessageEvent) => {
                //             if (isCompleted) return

                //             const { type, data, error } = event.data
                //             // console.log('收到 Worker 消息:', type, data, error)

                //             if (type === 'success') {
                //                 // console.log('Worker 处理成功')
                //                 isCompleted = true
                //                 resolve(data)
                //                 worker.terminate()
                //             } else if (type === 'error') {
                //                 console.error('Worker 处理失败:', error)
                //                 isCompleted = true
                //                 reject(new Error(error))
                //                 worker.terminate()
                //             }
                //         }

                //         worker.onerror = (error) => {
                //             if (isCompleted) return
                //             console.error('Worker 错误事件:', error)
                //             isCompleted = true
                //             reject(error)
                //             worker.terminate()
                //         }

                //         // 发送处理请求
                //         worker.postMessage({ type: 'processItemData', url: url })
                //     })
                //     .catch((error) => {
                //         console.error('导入 Worker 失败:', error)
                //         reject(error)
                //     })
                import('../worker/item-worker.ts?inline')
                    .then(({ default: workercode }) => {
                        // console.log('Worker 模块加载成功:', typeof workercode)

                        if (!workercode) {
                            throw new Error('Worker 代码未正确导入')
                        }

                        const blob = new Blob([workercode], { type: 'application/javascript' })
                        const workerUrl = URL.createObjectURL(blob)
                        // console.log('Blob URL 创建成功:', workerUrl)

                        const worker = new Worker(workerUrl)
                        // console.log('Worker 实例创建成功')

                        let isCompleted = false

                        worker.onmessage = (event: MessageEvent) => {
                            if (isCompleted) return // 防止重复处理

                            const { type, data, error } = event.data

                            // console.log('收到 Worker 消息:', type, data, error)

                            if (type === 'success') {
                                // console.log('Worker 处理成功')
                                isCompleted = true
                                resolve(data)
                                worker.terminate()
                                URL.revokeObjectURL(workerUrl)
                            } else if (type === 'error') {
                                console.error('Worker 处理失败:', error)
                                isCompleted = true
                                reject(new Error(error))
                                worker.terminate()
                                URL.revokeObjectURL(workerUrl)
                            }
                        }

                        worker.onerror = (error) => {
                            if (isCompleted) return
                            console.error('Worker 错误事件:', error)
                            isCompleted = true
                            reject(error)
                            worker.terminate()
                            URL.revokeObjectURL(workerUrl)
                        }

                        // 直接发送处理请求
                        // console.log('发送处理请求到 Worker')
                        worker.postMessage({ type: 'processItemData', url: url })
                    })
                    .catch((error) => {
                        console.error('导入 Worker 失败:', error)
                        reject(error)
                    })
            })
        },
        async getEquipData(url: string): Promise<Item[] | null> {
            return this.handleRequest('equip', async () => {
                const json = await fetchData<Record<string, Equipment>>(url)
                return Object.entries(json).map(([key, value]) => ({
                    label: `${value.CHS.name}: ${stripHtmlTags(value.CHS.desc2)}`,
                    value: key.slice(0, 3)
                }))
            })
        },
        async getShiyuData(url: string): Promise<Item[] | null> {
            return this.handleRequest('shiyu', async () => {
                const json = await fetchData<Record<string, Name>>(url)
                const list: Item[] = [{ label: '全解锁', value: '0' }]

                Object.entries(json).forEach(([key, value]) => {
                    list.push({
                        label: `${value.CHS}: ${key}`,
                        value: key
                    })
                })

                return list
            })
        },
        async getBossData(url: string): Promise<Item[] | null> {
            return this.handleRequest('boss', async () => {
                const json = await fetchData<Record<string, Name>>(url)
                const list: Item[] = [{ label: '全解锁', value: '0' }]

                Object.entries(json).forEach(([key, value]) => {
                    list.push({
                        label: `${value.CHS}: ${key}`,
                        value: key
                    })
                })

                return list
            })
        },
        async getMonsterData(url: string): Promise<Item[] | null> {
            return this.handleRequest('monster', async () => {
                const json = await fetchData<Record<string, Name>>(url)
                return Object.entries(json).map(([key, value]) => ({
                    label: `${value.CHS}: ${key}`,
                    value: key
                }))
            })
        },
        async getWeaponData(url: string): Promise<Item[] | null> {
            return this.handleRequest('weapon', async () => {
                const json = await fetchData<Record<string, Weapon>>(url)
                const list: Item[] = [
                    { label: 'S', value: '4', children: [] },
                    { label: 'A', value: '3', children: [] },
                    { label: 'B', value: '2', children: [] }
                ]

                Object.entries(json).forEach(([key, value]) => {
                    const rankIndex = list.findIndex((x) => x.value === String(value.rank))
                    if (rankIndex !== -1) {
                        list[rankIndex].children?.push({
                            label: value.CHS,
                            value: key
                        })
                    }
                })

                return list
            })
        },
        async getCharacterData(url: string): Promise<Item[] | null> {
            return this.handleRequest(
                'character',
                async () => {
                    const json = await fetchData<Record<string, CharacterData>>(url)

                    const characterPromises = Object.entries(json).map(async ([key, value]) => {
                        if (this.skinData.length === 0 && Object.keys(value.skin).length > 0) {
                            try {
                                const skinJson = await fetchData<SkinData>(
                                    `${this.skin_url}${key}.json`
                                )
                                const skinList = Object.entries(skinJson.Skin).map(
                                    ([skinKey, skinValue]) => ({
                                        value: skinKey,
                                        label: skinValue.Name
                                    })
                                )
                                this.skinData.push({
                                    label: value.CHS,
                                    value: key,
                                    children: skinList
                                })
                            } catch (skinError) {
                                console.warn(
                                    `Failed to load skin data for character ${key}:`,
                                    skinError
                                )
                            }
                        }

                        return {
                            label: value.CHS,
                            value: key
                        }
                    })

                    const results = await Promise.allSettled(characterPromises)

                    return results
                        .filter(
                            (result): result is PromiseFulfilledResult<Item> =>
                                result.status === 'fulfilled'
                        )
                        .map((result) => result.value)
                },
                500
            )
        },
        clearAllLoading() {
            this.loading = {}
        },
        clearLoading(key: string) {
            delete this.loading[key]
        }
    }
})
