interface ItemData {
    icon: string
    rank: number
    class: number
    name: string
}

interface SkinData {
    Skin: Record<string, Skin>
}

interface Skin {
    Name: string
    Desc: string
    Image: string
}

interface CharacterData extends Name {
    skin: Record<string, Skin> | {}
}

interface Weapon extends Name {
    rank: string
}

interface Name {
    CHS: string
}

interface Equipment {
    CHS: {
        name: string
        desc2: string
        desc4: string
    }
}

interface Item {
    label: string
    value: string
    children?: {
        label: string
        value: string
    }[]
}

interface Cfg {
    label: string
    arr: Item[]
    w?: string
    isCascader?: boolean
    isSearch?: boolean
    isBreak?: boolean
    isShowAllLevel?: boolean
    cmdConbineFn?: (pre: string, cur: Cfg, selected: T) => string
}
