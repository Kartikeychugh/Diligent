import { useState, useEffect, useCallback } from "react";

export const Draggable = (props: {
  stop?: boolean;
  items: string[];
  onOrderChange: (items: string[]) => void;
  renderProp: (id: string) => JSX.Element;
}) => {
  const { items, renderProp, onOrderChange, stop = false } = props;
  const [data, setData] = useState(items);
  const [dragging, setDragging] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    setData(items);
  }, [items]);

  const handleOnDrop = useHandleOnDropCallback(
    data,
    dragIndex,
    dropIndex,
    onOrderChange,
    setData,
    setDragging,
    setDropIndex,
    setDragIndex
  );

  const handleOnDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      const dragImage = e.currentTarget.cloneNode(true);
      (dragImage as HTMLElement).style.width = "200px";

      document.body.append(dragImage);
      e.dataTransfer.setDragImage(dragImage as HTMLElement, 0, 0);

      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);

      setDragging(true);
      setDragIndex(index);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      setDropIndex(index);
    },
    []
  );

  const handleOnDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropIndex(null);
    },
    []
  );

  useEffect(() => {
    const dragOverListener = function (e: DragEvent) {
      e.preventDefault();
    };

    const dropListener = function () {
      setDragging(false);
      setDropIndex(null);
      setDragIndex(null);
    };
    document.addEventListener("dragover", dragOverListener);
    document.addEventListener("drop", dropListener);

    return () => {
      document.removeEventListener("dragover", dragOverListener);
      document.removeEventListener("drop", dropListener);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dragging ? 0 : "5px",
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleOnDrop}
    >
      {data.map((entry, index) => {
        return (
          <div key={entry} style={{}}>
            <div
              style={{ position: "relative" }}
              onDragStart={(e) => {
                handleOnDragStart(e, index);
              }}
              draggable={!stop}
            >
              {dragging && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      height: "50%",
                      width: "100%",
                    }}
                    onDragOver={(e) => {
                      handleDragOver(e, index - 1);
                    }}
                    onDragLeave={handleOnDragLeave}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      height: "50%",
                      width: "100%",
                    }}
                    onDragOver={(e) => {
                      handleDragOver(e, index);
                    }}
                    onDragLeave={handleOnDragLeave}
                  ></div>
                </>
              )}
              {renderProp(entry)}
            </div>
            <div
              style={{
                height: dragging ? "20px" : 0,
                background: dropIndex === index ? "#e3e3e3" : "white",
                transition: "all 20ms",
                opacity: dropIndex === index ? "1" : "0.5",
                border: dropIndex === index ? "2px dashed grey" : "none",
                boxSizing: "border-box",
                borderRadius: "5px",
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

const useHandleOnDropCallback = (
  data: string[],
  dragIndex: number | null,
  dropIndex: number | null,
  onOrderChange: (order: string[]) => void,
  setData: React.Dispatch<React.SetStateAction<string[]>>,
  setDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setDropIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setDragIndex: React.Dispatch<React.SetStateAction<number | null>>
) =>
  useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragIndex !== null && dropIndex !== null) {
        const oldIndex = dragIndex;
        const newIndex = dropIndex;
        const newState = data.slice();
        newState.splice(oldIndex, 1);
        newState.splice(
          newIndex + (newIndex < oldIndex ? 1 : 0),
          0,
          data[oldIndex]
        );
        onOrderChange(newState);
        setData(newState);
      }

      setDragging(false);
      setDropIndex(null);
      setDragIndex(null);
    },
    [
      data,
      dragIndex,
      dropIndex,
      onOrderChange,
      setData,
      setDragIndex,
      setDragging,
      setDropIndex,
    ]
  );
