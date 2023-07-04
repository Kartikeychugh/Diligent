import { Box, Button, Paper, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { boldEntireNode, unboldEntireNode } from "./editor.utils";

declare const HtmlSanitizer: any;

const validateSelection = (containerNode: HTMLDivElement | null) => {
  const data = window.getSelection();

  if (!data || data.rangeCount === 0) return null;

  const range = data.getRangeAt(0);
  if (containerNode && containerNode.contains(range.commonAncestorContainer)) {
    return data.getRangeAt(0);
  }

  return null;
};

const getNextNode = (node: Node | null) => {
  if (!node) return null;

  if (node.firstChild) return node.firstChild as Node;
  while (node) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode as Node;
  }
  return null;
};

const getNodesInRange = (start: Node, end: Node) => {
  const nodes = [];
  let node: Node | null = start;

  while (node && node !== end) {
    if (node.nodeType === 3) nodes.push(node);
    node = getNextNode(node);
    if (node === end) break;
  }

  nodes.push(end);
  return nodes;
};

export const Editor = () => {
  const [bold, setBold] = useState(false);
  const divref = useRef<HTMLDivElement | null>(null);

  //   const onSelect = useCallback((e: React.ChangeEvent<HTMLParagraphElement>) => {
  //     const data = window.getSelection();
  //     if (!data) return;

  //     const range = data.getRangeAt(0);
  //     if (range.collapsed) {
  //       const anchorNode = data.anchorNode;
  //       console.log("Just click");
  //       return;
  //     }

  //     const startNode = range.startContainer;
  //     const endNode = range.endContainer;
  //     var nodes = getNodesInRange(startNode, endNode);

  //     nodes.forEach((node) => {
  //       if (node === startNode) {
  //         const newNode = document.createTextNode(
  //           node.nodeValue
  //             ? node.nodeValue!!!.substring(0, range.startOffset)
  //             : ""
  //         );
  //         const nextNode = document.createElement("strong");
  //         nextNode.innerText = node.nodeValue
  //           ? node.nodeValue!!!.substring(range.startOffset)
  //           : "";

  //         node.parentElement?.replaceChild(nextNode, node);
  //         nextNode.parentElement?.insertBefore(newNode, nextNode);
  //       } else if (node === endNode) {
  //         const newNode = document.createTextNode(
  //           node.nodeValue ? node.nodeValue!!!.substring(range.endOffset) : ""
  //         );
  //         const nextNode = document.createElement("strong");
  //         nextNode.innerText = node.nodeValue
  //           ? node.nodeValue!!!.substring(0, range.endOffset)
  //           : "";

  //         node.parentElement?.replaceChild(newNode, node);
  //         newNode.parentElement?.insertBefore(nextNode, newNode);
  //       } else {
  //         const nextNode = document.createElement("strong");
  //         nextNode.innerText = node.nodeValue!!!;
  //         node.parentElement?.replaceChild(nextNode, node);
  //       }
  //     });

  //     // let startIndex = Array.from(parent.childNodes).findIndex(
  //     //   (node) => node === startNode
  //     // );
  //     // let endIndex = Array.from(parent.childNodes).findIndex(
  //     //   (node) => node === endNode
  //     // );
  //     // console.log(startIndex, endIndex);
  //     // console.log(startOffset, endOffset);

  //     // const value = (e.target as HTMLParagraphElement).innerHTML;
  //     // console.log(value);
  //     // console.log(range);

  //     // const newHTML =
  //     //   value.substring(0, range.startOffset) +
  //     //   `<b>${value.substring(range.startOffset, range.endOffset)}</b>` +
  //     //   value.substring(range.endOffset, value.length);
  //     // console.log(newHTML);
  //     // (e.target as HTMLParagraphElement).innerHTML =
  //     //   HtmlSanitizer.SanitizeHtml(newHTML);
  //   }, []);

  const isSelectionBold = useCallback((startNode: Node | null) => {
    while (startNode && startNode !== divref.current) {
      if (startNode.nodeName.toLowerCase() === "strong") return true;
      startNode = startNode.parentNode;
    }
    return false;
  }, []);

  const onSelect = useCallback(() => {
    const range = validateSelection(divref.current);
    if (!range) return;
    if (isSelectionBold(range.startContainer)) setBold(true);
    else setBold(false);
  }, [isSelectionBold]);

  const rangeBold = useCallback(
    (range: Range) => {
      const startNode = (
        range.startContainer as ReturnType<typeof document.createTextNode>
      ).splitText(range.startOffset);

      (
        range.endContainer as ReturnType<typeof document.createTextNode>
      ).splitText(range.endOffset);

      const rangeNodes = getNodesInRange(startNode, range.endContainer)
        .filter((node) => node.nodeValue && !isSelectionBold(node))
        .map((node) => boldEntireNode(node));

      let r = new Range();

      r.setStart(rangeNodes[0], 0);
      r.setEnd(rangeNodes[rangeNodes.length - 1], 1);

      window.getSelection()?.removeAllRanges();
      const s = window.getSelection();
      if (s) s.addRange(r);
    },
    [isSelectionBold]
  );

  const singlePointBold = useCallback(
    (range: Range) => {
      //   console.log("single point click");
      //   console.log(isSelectionBold(range.startContainer));
      //   console.log(getNodesInRange(range.startContainer, range.endContainer));
    },
    [isSelectionBold]
  );

  const makeBold = useCallback(() => {
    const range = validateSelection(divref.current);
    if (!range) return;

    if (range.collapsed) {
      singlePointBold(range);
    } else {
      rangeBold(range);
    }
  }, [rangeBold, singlePointBold]);

  return (
    <Paper>
      <Box>
        <div
          style={{ width: "500px" }}
          ref={divref}
          contentEditable
          onClick={onSelect}
        ></div>
        <Box>
          <Button onClick={makeBold} variant={bold ? "contained" : "text"}>
            B
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
