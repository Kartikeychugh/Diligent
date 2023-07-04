export const unboldEntireNode = (node: Node | null, root: Node | null) => {
  while (node && node !== root) {
    if (node.nodeName === "STRONG") break;
    node = node.parentElement;
  }

  if (!node || node === root) return false;

  const strongEleParent = node.parentElement;
  node.childNodes.forEach((child) => {
    strongEleParent?.insertBefore(child, node);
  });

  strongEleParent?.removeChild(node);

  return true;
};

export const boldEntireNode = (node: Node) => {
  const cloneNode = node.cloneNode();
  const parent = node.parentElement;
  const newNode = document.createElement("strong");
  newNode.appendChild(cloneNode);
  parent?.replaceChild(newNode, node);
  return newNode;
};
