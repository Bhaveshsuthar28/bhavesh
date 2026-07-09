"use client";

import React, { useState, useEffect, useRef } from "react";

interface TypewriterContainerProps {
  children: React.ReactNode;
  speed?: number;
}

export default function TypewriterContainer({ children, speed = 2 }: TypewriterContainerProps) {
  const [charLimit, setCharLimit] = useState(0);
  const totalLength = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let len = 0;
    const calculateLength = (node: React.ReactNode) => {
      if (node === undefined || node === null) return;

      if (React.isValidElement(node)) {
        if ((node.props as any)["data-bypass-typewriter"] || (node.props as any).bypassTypewriter) {
          return; // Bypassed nodes don't count towards typed char length
        }
        React.Children.forEach((node.props as any).children, calculateLength);
      } else if (Array.isArray(node)) {
        node.forEach(calculateLength);
      } else if (typeof node === "string" || typeof node === "number") {
        len += String(node).length;
      }
    };
    calculateLength(children);
    totalLength.current = len;

    setCharLimit(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCharLimit((prev) => {
        if (prev >= len) {
          if (timerRef.current) clearInterval(timerRef.current);
          return len;
        }
        // Adaptive typing speed based on content length
        const step = Math.max(1, Math.floor(len / 100));
        return prev + step;
      });
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [children, speed]);

  let charsRendered = 0;
  const renderTree = (node: React.ReactNode): React.ReactNode => {
    if (node === undefined || node === null) return node;

    if (React.isValidElement(node)) {
      if ((node.props as any)["data-bypass-typewriter"] || (node.props as any).bypassTypewriter) {
        return node; // Return bypassed elements immediately
      }

      const nodeChildren = (node.props as any).children;
      if (nodeChildren === undefined || nodeChildren === null) {
        return node;
      }

      const newChildren = React.Children.map(nodeChildren, renderTree);
      return React.cloneElement(node, {}, newChildren);
    }

    if (Array.isArray(node)) {
      return node.map((child, idx) => (
        <React.Fragment key={idx}>{renderTree(child)}</React.Fragment>
      ));
    }

    if (typeof node === "string" || typeof node === "number") {
      const str = String(node);
      const remaining = charLimit - charsRendered;
      if (remaining <= 0) return "";
      charsRendered += str.length;
      if (remaining >= str.length) {
        return str;
      }
      return str.slice(0, remaining);
    }

    return node;
  };

  return <>{renderTree(children)}</>;
}
