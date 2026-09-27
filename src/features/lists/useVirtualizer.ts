import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface VirtualItem {
  index: number;
  offsetTop: number;
  height: number;
}

export interface UseVirtualizerOptions {
  count: number;
  itemHeight: number;
  overscan?: number;
  scrollElementRef: React.RefObject<HTMLElement | null>;
}

export interface UseVirtualizerReturn {
  virtualItems: VirtualItem[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  renderedCount: number;
  scrollTop: number;
  containerHeight: number;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  topPadding: number;
  bottomPadding: number;
}

/**
 * ============================================================================
 * 🧠 ARCHITECTURAL NOTES: HOW TO BUILD A REACT VIRTUALIZER FROM SCRATCH
 * ============================================================================
 *
 * ❓ PROBLEM:
 * When you render 10,000+ items directly into the React DOM tree:
 * 1. Memory Explosion: 10,000 DOM nodes consume hundreds of megabytes of RAM.
 * 2. Layout Thrashing & Dropped Frames: Every keystroke, resize, or hover causes 
 *    the browser engine to recalculate styles and layout for all 10,000 elements.
 * 3. Browser Freezes: Initial mount takes seconds, and scrolling stutters below 10 FPS.
 *
 * 💡 SOLUTION: "WINDOWING" (VIRTUALIZATION)
 * Instead of mounting all 10,000 items, mount ONLY the 10 to 15 items currently
 * visible inside the user's scroll viewport. As the user scrolls, recycling happens:
 * DOM nodes that scroll out of view are unmounted or repositioned.
 *
 * 🛠️ THE 5 CORE STEPS TO IMPLEMENT VIRTUALIZATION:
 *
 * ----------------------------------------------------------------------------
 * STEP 1: Define the Scroll Container & Virtual Canvas
 * ----------------------------------------------------------------------------
 * The container must have a fixed height (e.g. `height: 480px`) and `overflow-y: auto`.
 * Inside it, we create a phantom inner container with:
 *   `totalHeight = count * itemHeight`
 * This tricks the browser's native scrollbar into behaving exactly as if all 100,000
 * items were fully present in the document.
 *
 * ----------------------------------------------------------------------------
 * STEP 2: Measure Viewport & Listen to Scroll (60 FPS Throttling)
 * ----------------------------------------------------------------------------
 * We observe container height changes with `ResizeObserver` (so responsive resizing
 * never breaks item counts).
 * On scroll, we read `el.scrollTop`. To prevent React from re-rendering on every
 * single micro-scroll event (which would kill performance), we wrap state updates
 * in `requestAnimationFrame` (RAF).
 *
 * ----------------------------------------------------------------------------
 * STEP 3: Compute the Visible Slice (startIndex & endIndex)
 * ----------------------------------------------------------------------------
 * Using basic division:
 *   firstVisible = Math.floor(scrollTop / itemHeight)
 *   lastVisible  = Math.floor((scrollTop + containerHeight) / itemHeight)
 *
 * We clamp the values between 0 and `count - 1`:
 *   startIndex = Math.max(0, firstVisible - overscan)
 *   endIndex   = Math.min(count - 1, lastVisible + overscan)
 *
 * ----------------------------------------------------------------------------
 * STEP 4: Add an "Overscan" Buffer
 * ----------------------------------------------------------------------------
 * Fast mouse-wheel or touch momentum scrolling can move faster than React's render loop.
 * If you only render visible items, users will see a white blank flash before items mount.
 * An overscan buffer (e.g. +3 items above and below) renders off-screen items ahead of time,
 * guaranteeing zero flickering.
 *
 * ----------------------------------------------------------------------------
 * STEP 5: Position the Rendered Window (Phantom Spacers or translateY)
 * ----------------------------------------------------------------------------
 * Since we only render items [startIndex .. endIndex], they would normally snap to
 * the very top of the scroll container.
 * We must push them down to their correct geometric scroll position.
 * Method A (Used below): Top Phantom Spacer (`topPadding = startIndex * itemHeight`)
 * Method B: Absolute positioning with `transform: translateY(offsetTop px)`
 *
 * ============================================================================
 */
export function useVirtualizer({
  count,
  itemHeight,
  overscan = 3,
  scrollElementRef,
}: UseVirtualizerOptions): UseVirtualizerReturn {
  // State for container scroll position and viewport height
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);
  const rafIdRef = useRef<number | null>(null);

  // --------------------------------------------------------------------------
  // STEP 1: Measure Container Height dynamically with ResizeObserver
  // --------------------------------------------------------------------------
  useEffect(() => {
    const el = scrollElementRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el) {
        setContainerHeight(el.clientHeight || 400);
      }
    };

    updateHeight();

    // ResizeObserver watches window resizing or layout shifts
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollElementRef]);

  // --------------------------------------------------------------------------
  // STEP 2: Listen to Scroll Events with 60 FPS requestAnimationFrame throttling
  // --------------------------------------------------------------------------
  useEffect(() => {
    const el = scrollElementRef.current;
    if (!el) return;

    const handleScroll = () => {
      // Cancel previous scheduled frame to avoid redundant queue backlog
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      // Schedule state update synchronized with the browser's monitor refresh rate
      rafIdRef.current = requestAnimationFrame(() => {
        if (el) {
          setScrollTop(el.scrollTop);
        }
      });
    };

    // passive: true improves touch and wheel scroll performance
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [scrollElementRef]);

  // --------------------------------------------------------------------------
  // STEP 3 & 4: Calculate the Window Slice with Overscan
  // --------------------------------------------------------------------------
  const { startIndex, endIndex } = useMemo(() => {
    if (count === 0) {
      return { startIndex: 0, endIndex: -1 };
    }

    // Index of first visible element in the viewport
    const rawStartIndex = Math.floor(scrollTop / itemHeight);
    // Index of last visible element at the bottom of the viewport
    const rawEndIndex = Math.floor((scrollTop + containerHeight) / itemHeight);

    // Apply overscan buffer to render a few items ahead of scroll direction
    const clampedStartIndex = Math.max(0, rawStartIndex - overscan);
    const clampedEndIndex = Math.min(count - 1, rawEndIndex + overscan);

    return {
      startIndex: clampedStartIndex,
      endIndex: clampedEndIndex,
    };
  }, [scrollTop, containerHeight, itemHeight, count, overscan]);

  // --------------------------------------------------------------------------
  // STEP 5: Construct array of virtual items to mount in the DOM
  // --------------------------------------------------------------------------
  const virtualItems = useMemo<VirtualItem[]>(() => {
    if (endIndex < startIndex || count === 0) return [];

    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
        height: itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight, count]);

  // Total phantom height creates the natural native scrollbar
  const totalHeight = count * itemHeight;

  // Phantom spacer heights:
  // topPadding: pushes mounted items down so they match the current scroll position
  const topPadding = startIndex * itemHeight;
  // bottomPadding: fills remaining space below the mounted items
  const bottomPadding = Math.max(0, (count - endIndex - 1) * itemHeight);
  const renderedCount = virtualItems.length;

  // Programmatic scroll helper (Jump to item index)
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollElementRef.current;
      if (!el) return;

      const targetIndex = Math.max(0, Math.min(count - 1, index));
      const targetScrollTop = targetIndex * itemHeight;

      el.scrollTo({
        top: targetScrollTop,
        behavior,
      });
    },
    [count, itemHeight, scrollElementRef]
  );

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    renderedCount,
    scrollTop,
    containerHeight,
    scrollToIndex,
    topPadding,
    bottomPadding,
  };
}
