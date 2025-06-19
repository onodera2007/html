const MainStat = [
    { value: '11103 550', short: 'HP', label: '生命值(1)' },
    { value: '12103 79', short: 'ATK', label: '攻击力(2)' },
    { value: '13103 46', short: 'DEF', label: '防御力(3)' },
    { value: '11102 750', short: 'HP%', label: '生命值百分比(4-6)' },
    { value: '12102 750', short: 'ATK%', label: '攻击力百分比(4-6)' },
    { value: '13102 1200', short: 'DEF%', label: '防御力百分比(4-6)' },
    { value: '31203 23', short: 'AP', label: '异常精通(4)' },
    { value: '21103 1200', short: 'CD', label: '暴击伤害(4)' },
    { value: '20103 600', short: 'CR', label: '暴击率(4)' },
    { value: '23103 600', short: 'PEN%', label: '穿透率(5)' },
    { value: '31803 750', short: 'El', label: '电属性伤害加成(5)' },
    { value: '31903 750', short: 'Et', label: '以太属性伤害加成(5)' },
    { value: '31603 750', short: 'Fi', label: '火属性伤害加成(5)' },
    { value: '31703 750', short: 'Ic', label: '冰属性伤害加成(5)' },
    { value: '31503 750', short: 'Ph', label: '物理伤害加成(5)' },
    { value: '31402 750', short: 'AM', label: '异常掌控(6)' },
    { value: '30502 1500', short: 'ER', label: '能量自动恢复(6)' },
    { value: '12202 450', short: 'I', label: '冲击力(6)' }
]
const SubStat = [
    { value: '11103 112', short: 'HP', label: '生命值' },
    { value: '12103 19', short: 'ATK', label: '攻击力' },
    { value: '13103 15', short: 'DEF', label: '防御力' },
    { value: '11102 300', short: 'HP%', label: '生命值百分比' },
    { value: '12102 300', short: 'ATK%', label: '攻击力百分比' },
    { value: '13102 480', short: 'DEF%', label: '防御力百分比' },
    { value: '23203 9', short: 'PEN', label: '穿透值' },
    { value: '31203 9', short: 'AP', label: '异常精通' },
    { value: '21103 480', short: 'CD', label: '暴击伤害' },
    { value: '20103 240', short: 'CR', label: '暴击率' }
]

const row1: Cfg[] = [{ label: '物品', arr: [], isSearch: true, w: '400px' }]
const row2: Cfg[] = [
    {
        label: '绳网等级',
        arr: Array.from({ length: 60 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
    }
]
const row3: Cfg[] = [{ label: '角色全解锁', arr: [] }]
const row4: Cfg[] = [
    { label: '代理人', arr: [], isSearch: true },
    {
        label: '代理人等级',
        arr: Array.from({ length: 60 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
    }
]
const row5: Cfg[] = [
    { label: '代理人', arr: [], isSearch: true },
    {
        label: '代理人技能等级',
        isCascader: true,
        isShowAllLevel: true,
        arr: [
            {
                label: '普通攻击',
                value: '0',
                children: Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            },
            {
                label: '闪避',
                value: '2',
                children: Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            },
            {
                label: '特殊技',
                value: '1',
                children: Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            },
            {
                label: '连携技',
                value: '3',
                children: Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            },
            {
                label: '支援技',
                value: '6',
                children: Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            },
            {
                label: '核心技',
                value: '5',
                children: ['0', 'A', 'B', 'C', 'D', 'E', 'F'].map((x, i) => ({
                    label: `${x}`,
                    value: `${i}`
                }))
            }
        ],
        cmdConbineFn: (pre, _cur, selected) => {
            if (selected.CascaderSelect) {
                return (pre += ` ${selected.CascaderSelect.join(' ')}`)
            } else return ''
        }
    }
]
const row6: Cfg[] = [
    { label: '代理人', arr: [], isSearch: true },
    {
        label: '影画',
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
    }
]
const row7: Cfg[] = [
    {
        label: '武器',
        arr: [],
        isCascader: true,
        isSearch: true,
        cmdConbineFn: (pre, _cur, selected) => {
            if (selected.CascaderSelect) {
                return (pre += ` ${selected.CascaderSelect.join(' ')}`)
            } else return ''
        }
    },
    {
        label: '武器等级',
        arr: Array.from({ length: 60 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
        cmdConbineFn: (pre, _cur, selected) => {
            const parts = pre.trim().split(/\s+/).reverse()
            let str = [parts[0], selected.select, parts[1]].join(' ')
            return ` ${str}`
        }
    },
    {
        label: '武器精炼等级',
        arr: Array.from({ length: 5 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
    }
]
const row8: Cfg[] = [
    { label: '驱动盘', arr: [], isSearch: true, w: '300px', isBreak: true },
    {
        label: '驱动盘稀有度',
        arr: [
            { label: 'S', value: '4', children: [] },
            { label: 'A', value: '3', children: [] },
            { label: 'B', value: '2', children: [] }
        ],
        cmdConbineFn(pre, _cur, selected) {
            return (pre += selected.select)
        }
    },
    {
        label: '驱动盘槽位',
        cmdConbineFn(pre, _cur, selected) {
            return (pre += `${selected.select} `)
        },
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
    },
    {
        label: '驱动盘等级',
        arr: Array.from({ length: 15 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
        cmdConbineFn(pre, _cur, selected) {
            return (pre += `${selected.select} 0 [`)
        }
    },
    {
        label: '主属性',
        isBreak: true,
        w: '150px',
        arr: MainStat.map(({ label, value }) => ({ label, value })),
        cmdConbineFn(pre, _cur, selected) {
            return (pre += `${selected.select} 1`)
        }
    },
    {
        label: '副属性1',
        w: '150px',
        arr: SubStat.map(({ label, value }) => ({ label, value }))
    },
    {
        label: '副属性等级1',
        isBreak: true,
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i}`, value: `${i + 1}` }))
    },
    {
        label: '副属性2',
        w: '150px',
        arr: SubStat.map(({ label, value }) => ({ label, value }))
    },
    {
        label: '副属性等级2',
        isBreak: true,
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i}`, value: `${i + 1}` }))
    },
    {
        label: '副属性3',
        w: '150px',
        arr: SubStat.map(({ label, value }) => ({ label, value }))
    },
    {
        label: '副属性等级3',
        isBreak: true,
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i}`, value: `${i + 1}` }))
    },
    {
        label: '副属性4',
        w: '150px',
        arr: SubStat.map(({ label, value }) => ({ label, value }))
    },
    {
        label: '副属性等级4',
        arr: Array.from({ length: 6 }, (_, i) => ({ label: `${i}`, value: `${i + 1}` })),
        cmdConbineFn: (pre, _cur, selected) => {
            return (pre += ` ${selected.select}]`)
        }
    }
]

const row9: Cfg[] = [
    {
        label: '代理人皮肤',
        arr: [],
        isCascader: true,
        cmdConbineFn: (pre, _cur, selected) => {
            if (selected.CascaderSelect) {
                return (pre += ` ${selected.CascaderSelect.join(' ')}`)
            } else return ''
        }
    }
]
const row10: Cfg[] = [{ label: '控制代理人', arr: [], isSearch: true }]
const row11: Cfg[] = [{ label: '重置每日任务', arr: [] }]
const row12: Cfg[] = [{ label: '式舆防卫战', arr: [], isSearch: true }]
const row13: Cfg[] = [{ label: '危局强袭战', arr: [], isSearch: true }]
const row14: Cfg[] = [{ label: '解锁怪物卡牌', arr: [{ label: '全解锁', value: '0' }], w: '100px' }]

export const useConst = defineStore('const', {
    state: () => ({
        row1,
        row2,
        row3,
        row4,
        row5,
        row6,
        row7,
        row8,
        row9,
        row10,
        row11,
        row12,
        row13,
        row14
    })
})
