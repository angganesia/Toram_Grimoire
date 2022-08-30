function getExampleMdText() {
  return `## 標題

\`\`\`
# 標題1
## 標題2
### 標題3
#### 標題4
##### 標題5
###### 標題6
\`\`\`

# 標題1
## 標題2
### 標題3
#### 標題4
##### 標題5
###### 標題6

## 文字區塊

這是一段普通的文字。
這是普通文字的第二行。

多空一行的話就是新的區塊了。

## 字體變化
這些語法或許有點眼熟0.0

\`\`\`
**強調**
*我是斜體*
~~刪除線~~

也可以混用這些語法。例如~~***這是範例***~~。

這是((=特殊的大括號))。
\`\`\`

**強調**
*我是斜體*
~~刪除線~~

也可以混用這些語法。例如~~***這是範例***~~。

這是((=特殊的大括號))。

---
## 項目
可以用簡單的語法呈現項目清單。

\`\`\`
- 我是沒有數字的項目。
- 項目2。
- 項目3。
\`\`\`

- 我是沒有數字的項目。
- 項目2。
- 項目3。

---
\`\`\`
+ 我是改用\`+\`的項目。
+ 項目2。
\`\`\`

+ 我是改用\`+\`的項目。
+ 項目2。

---
\`\`\`
* 我是改用\`*\`的項目。
* 項目2。
\`\`\`

* 我是改用\`*\`的項目。
* 項目2。

---
\`\`\`
1. 這裡是有數字的項目。
2. 喵。
3. 項目3。
\`\`\`

1. 這裡是有數字的項目。
2. 喵。
3. 項目3。

---
\`\`\`
1. 有數字的項目數字會自動遞增。
2. 只要你想的話，可以每個數字都一樣。
1. 項目3。
1. 0.0
\`\`\`

1. 有數字的項目數字會自動遞增。
2. 只要你想的話，可以每個數字都一樣。
1. 項目3。
1. 0.0

## 代辦清單

\`\`\`
- [x] 項目1
- [ ] 項目2
- [ ] 項目3
\`\`\`

- [x] 項目1
- [ ] 項目2
- [ ] 項目3

## 引用文字區塊

\`\`\`
> 我是引用文字。
\`\`\`

> 我是引用文字。

\`\`\`
> 引用文字也可以混合其他語法。
> - 項目1。
> - 項目2。
>
> > 巢狀。
> >
> > 喵0.0
\`\`\`

> 引用文字也可以混合其他語法。
> - 項目1。
> - 項目2。
>
> > 巢狀。
> >
> > 喵0.0

## 程式碼區塊
程式碼區塊內，英文、數字、符號等會採用等寬字體。如果要顯示公式適合寫在這裡。

\`\`\`
(ATK-DEF+200)*(100-20)%*1000
\`\`\`

程式碼區塊也支援寫在句子中的寫法，例如\`A\`、\`1+2=3\`。

## 連結

\`\`\`
[Toram Online](https://tw.toram.jp/)
\`\`\`

[Toram Online](https://tw.toram.jp/)

## 圖片
和連結不太一樣的是，語法上最前面多了一個\`!\`。

\`\`\`
![Toram](https://play-lh.googleusercontent.com/0BGXxalnP2iMKn3kREQ65QnME7QzUalGasG7M_HnriOQ0L5GGgYBQG4AoDGX8lRQcppD)
\`\`\`

![Toram](https://play-lh.googleusercontent.com/0BGXxalnP2iMKn3kREQ65QnME7QzUalGasG7M_HnriOQ0L5GGgYBQG4AoDGX8lRQcppD)

## 表格
表格算是比較進階的語法（？

\`\`\`
| 欄位1 | 欄位2 | 欄位3 |
| ---- | -----:|:------ |
| 普通欄位 | 向右對齊 | 向左對齊 |
| 0.0 | 喵 | ... |
\`\`\`

| 欄位1 | 欄位2 | 欄位3 |
| ---- | -----:|:------ |
| 普通欄位 | 向右對齊 | 置中對齊 |
| 0.0 | 喵 | ... |

- 表格的每一格用\`|\`隔開。
- 第一行表示表格的**標題列**。
- 第二行除了\`|\`之外，每一格必須包含\`-\`，這樣才可以定義一個表格。\`-\`的數量沒有規定，可自行依照排版需求增減。
- 在第二行可以用\`:\`控制每一欄的水平對齊。

*下面是一個簡單範例。*

\`\`\`
| 技能名稱 | 異常狀態 | 說明 |
| --- | --- | --- |
| 威力攻擊 | 膽怯 | 少數可以100%膽怯的技能，也是單手劍最常使用的膽怯技能。 |
| 黏液射擊 | 遲緩 | 算是弓手限定的100%遲緩技能。由於遲緩對於BOSS的效果很不明顯，大部分人都只點1等或點5等路過。只有對上少上被遲緩會增傷的BOSS時才會拿來使用。 |
| 音速波動 | 翻覆 | 在**音速擠壓**出現之前唯一能100%翻覆的技能，有好幾年的時間都是拳坦的絕對優勢。 |
\`\`\`

| 技能名稱 | 異常狀態 | 說明 |
| --- | --- | --- |
| 威力攻擊 | 膽怯 | 少數可以100%膽怯的技能，也是單手劍最常使用的膽怯技能。 |
| 黏液射擊 | 遲緩 | 算是弓手限定的100%遲緩技能。由於遲緩對於BOSS的效果很不明顯，大部分人都只點1等或點5等路過。只有對上少上被遲緩會增傷的BOSS時才會拿來使用。 |
| 音速波動 | 翻覆 | 在**音速擠壓**出現之前唯一能100%翻覆的技能，有好幾年的時間都是拳坦的絕對優勢。 |

## 分隔線

\`\`\`
---
\`\`\`

---
`
}

export function getExamplePagesText() {
  return `\
@detail,
latest_update,2020/03/09 13:39
author,Cyteria
@equipment,
-5,
@content,
"${getExampleMdText()}",`
}
