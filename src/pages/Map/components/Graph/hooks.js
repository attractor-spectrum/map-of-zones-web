import { useCallback, useMemo } from 'react';
import tinycolor from 'tinycolor2';

export const useNodeCanvasObject = (
  zoneWeightAccessor,
  focusedNode,
  focusedNodeNeighbors,
  nodeRelSize,
) =>
  useCallback(
    (node, ctx, globalScale) => {
      const { x, y, name, color } = node;
      const fontSize = 12 / globalScale;
      const textWidth = ctx.measureText(name).width;
      const backgroundDimensions = [textWidth, fontSize].map(
        n => n + fontSize * 0.5,
      );
      const r =
        Math.sqrt(Math.max(0, node[zoneWeightAccessor] || 1)) * nodeRelSize;
      const deltaY = r + backgroundDimensions[1] / 2 + 2 / globalScale;

      if (focusedNode) {
        if (
          focusedNode === node ||
          (focusedNodeNeighbors && focusedNodeNeighbors.includes(node))
        ) {
          ctx.fillStyle = color;
        } else {
          ctx.fillStyle = tinycolor(color)
            .desaturate(25)
            .setAlpha(0.9)
            .toString();
        }
      } else {
        ctx.fillStyle = color;
      }

      if (focusedNode === node) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.shadowColor = null;
      ctx.shadowBlur = null;
      ctx.font = `${fontSize}px Poppins`;
      ctx.fillStyle = 'rgba(10, 11, 42, 0.5)';
      ctx.fillRect(
        x - backgroundDimensions[0] / 2,
        y - backgroundDimensions[1] / 2 + deltaY,
        ...backgroundDimensions,
      );
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(235, 235, 235, 0.6)';
      ctx.fillText(name, x, y + deltaY);
    },
    [zoneWeightAccessor, focusedNode, focusedNodeNeighbors, nodeRelSize],
  );

export const useFocusedNodeNeighbors = (focusedNode, graph) =>
  useMemo(
    () =>
      focusedNode
        ? graph.neighbors(focusedNode.id).map(id => graph.node(id))
        : null,
    [focusedNode, graph],
  );

export const useLinkColor = focusedNode =>
  useCallback(
    ({ source, target }) => {
      if (!focusedNode) {
        return 'rgba(255, 255, 255, 0.5)';
      }

      if (focusedNode === source || focusedNode === target) {
        return 'rgba(255, 255, 255, 0.5)';
      }

      return 'rgba(255, 255, 255, 0.1)';
    },
    [focusedNode],
  );