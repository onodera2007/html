/// <reference lib="webworker" />

// console.log('Worker 脚本开始执行')

// 工具函数：移除 HTML 标签
function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '')
}

const fetchData = async <T>(url: string): Promise<T> => {
    // console.log('Worker fetchData 被调用:', url)
    try {
        const response = await fetch(url)
        // console.log('Worker fetch 响应状态:', response.status)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        // console.log('Worker fetch 数据:', data)
        return data
    } catch (error) {
        // console.error('Worker fetch 错误:', error)
        throw error
    }
}

// 处理 item 数据
async function processItemData(url: string) {
    // console.log('Worker processItemData 开始处理:', url)
    try {
        const json = await fetchData<Record<string, any>>(url)

        const result = Object.entries(json).map(([key, value]) => ({
            label: `${stripHtmlTags(value.name)}: ${key}`,
            value: key
        }))

        // console.log('Worker 处理结果:', result)
        return result
    } catch (error) {
        console.error('Worker processItemData 错误:', error)
        throw error
    }
}

// 监听主线程消息
self.onmessage = async function (event: MessageEvent) {
    // 过滤掉非目标消息（如来自 DevTools 等）
    if (!event.data || typeof event.data !== 'object' || !event.data.type) {
        return
    }

    // console.log('Worker 收到消息:', event.data)

    const { type, url } = event.data

    // 只处理来自主线程的特定消息类型
    if (type !== 'processItemData') {
        // console.log('Worker 忽略未知消息类型:', type)
        return
    }

    try {
        // console.log('Worker 开始处理 processItemData:', url)
        const result = await processItemData(url)
        // console.log('Worker 处理完成，准备发送结果:', result)

        self.postMessage({
            type: 'success',
            data: result
        })
        // console.log('Worker 结果已发送')
    } catch (error) {
        console.error('Worker 处理错误:', error)
        self.postMessage({
            type: 'error',
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

// 添加错误处理
self.addEventListener('error', function (event: ErrorEvent) {
    console.error('Worker 全局错误:', event)
    self.postMessage({
        type: 'error',
        error: event.message || 'Unknown worker error'
    })
})

// console.log('Worker 脚本执行完成')

// 导出 Worker 代码作为字符串，供 inline 导入使用
export default `
/// <reference lib="webworker" />

// console.log('Worker 脚本开始执行')

// 工具函数：移除 HTML 标签
function stripHtmlTags(html) {
    return html.replace(/<[^>]*>/g, '')
}

const fetchData = async (url) => {
    // console.log('Worker fetchData 被调用:', url)
    try {
        const response = await fetch(url)
        // console.log('Worker fetch 响应状态:', response.status)

        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`)
        }

        const data = await response.json()
        // console.log('Worker fetch 数据:', data)
        return data
    } catch (error) {
        console.error('Worker fetch 错误:', error)
        throw error
    }
}

// 处理 item 数据
async function processItemData(url) {
    // console.log('Worker processItemData 开始处理:', url)
    try {
        const json = await fetchData(url)

        const result = Object.entries(json).map(([key, value]) => ({
            label: \`\${stripHtmlTags(value.name)}: \${key}\`,
            value: key
        }))

        // console.log('Worker 处理结果:', result)
        return result
    } catch (error) {
        console.error('Worker processItemData 错误:', error)
        throw error
    }
}

// 监听主线程消息 - 使用 onmessage 而不是 addEventListener
self.onmessage = async function (event) {
    // 过滤掉非目标消息（如来自 DevTools 等）
    if (!event.data || typeof event.data !== 'object' || !event.data.type) {
        return
    }

    // console.log('Worker 收到消息:', event.data)

    const { type, url } = event.data

    // 只处理特定的消息类型，忽略其他消息
    if (type !== 'processItemData') {
        // console.log('Worker 忽略未知消息类型:', type)
        return
    }

    try {
        // console.log('Worker 开始处理 processItemData:', url)
        const result = await processItemData(url)
        // console.log('Worker 处理完成，准备发送结果:', result)

        self.postMessage({
            type: 'success',
            data: result
        })
        // console.log('Worker 结果已发送')
    } catch (error) {
        console.error('Worker 处理错误:', error)
        self.postMessage({
            type: 'error',
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

// 添加错误处理
self.addEventListener('error', function (event) {
    console.error('Worker 全局错误:', event)
    self.postMessage({
        type: 'error',
        error: event.message || 'Unknown worker error'
    })
})

// console.log('Worker 脚本执行完成')
`
