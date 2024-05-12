export const findMenuFromPathName = (path: string) => {
  const list = path?.replace(/^\/+/, '')?.split('/')
  if (list && list.length) return list[0]
  return ''
}

export const menuToTree = (menuList: any) => {
  const map: any = {}
  const tree: any[] = []

  // Create a map of ids to their respective objects
  menuList.forEach((item: any) => {
    map[item.menuId] = { ...item, children: [] }
  })

  // Construct the tree based on parent-child relationships
  menuList.forEach((item: any) => {
    if (item.parentMenuId !== null) {
      map[item.parentMenuId].children.push(map[item.menuId])
    } else {
      tree.push(map[item.menuId])
    }
  })

  return tree
}
