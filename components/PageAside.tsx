import { type Block, type ExtendedRecordMap } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import { PageSocial } from './PageSocial'

// TOC 项目类型
type TocItem = {
  id: string
  title: string
  level: number
}

// 递归获取页面的 H2/H3 标题
function getPageTableOfContents(block: Block, recordMap: ExtendedRecordMap): TocItem[] {
  const toc: TocItem[] = []

  const blocks = recordMap.block || {}
  Object.values(blocks).forEach((b) => {
    const value = b.value
    if (!value || !value.type) return

    // 仅 H2/H3
    if (value.type === 'header' || value.type === 'sub_header' || value.type === 'sub_sub_header') {
      const levelMap = { header: 2, sub_header: 3, sub_sub_header: 4 }
      const level = levelMap[value.type] || 2
      const title = getBlockTitle(value, recordMap) || ''
      const id = value.id
      toc.push({ id, title, level })
    }
  })

  return toc
}

export function PageAside({
  block,
  recordMap,
  isBlogPost
}: {
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}) {
  if (!block) return null

  // 仅文章页显示 TOC
  if (isBlogPost) {
    const toc = getPageTableOfContents(block, recordMap)
    if (!toc || toc.length === 0) return null

    return (
      <aside className="floating-toc" style={{ position: 'sticky', top: 80 }}>
        <h4>Contents</h4>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {toc.map((item) => (
            <li key={item.id} style={{ marginLeft: (item.level - 2) * 16 }}>
              <a href={`#${item.id}`} className="toc-link">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    )
  }

  // 首页或非文章页显示社交内容
  return <PageSocial />
}
