'use client';

import { useRef } from 'react';
import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';

// Keep the width/data-align format used by articles created with the old editor.
function imageWidth(value: unknown): string {
  const width = String(value ?? '100%');
  if (/^\d+(\.\d+)?$/.test(width)) return `${width}px`;
  return /^\d+(\.\d+)?(px|%)$/.test(width) ? width : '100%';
}

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; width: number; direction: number } | null>(null);
  const align = node.attrs.align || 'center';
  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    drag.current = { x: event.clientX, width: image.current?.getBoundingClientRect().width || 300,
      direction: event.currentTarget.dataset.corner?.endsWith('left') ? -1 : 1 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <NodeViewWrapper className="my-6 flex w-full" ref={container}
      style={{ justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center' }}>
      <div className={`relative max-w-full ${selected ? 'ring-2 ring-black ring-offset-2' : ''}`}
        style={{ width: imageWidth(node.attrs.width) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={image} src={node.attrs.src} alt={node.attrs.alt || ''}
          title={node.attrs.title || undefined} draggable={false}
          className="block w-full h-auto border border-[#E0E0E0]" />
        {selected && ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
          <button key={corner} type="button" contentEditable={false} data-corner={corner}
            aria-label={`Resize image from ${corner}`} title="Drag to resize image"
            className="absolute w-3.5 h-3.5 bg-black border-2 border-white"
            style={{
              top: corner.startsWith('top') ? -7 : undefined,
              bottom: corner.startsWith('bottom') ? -7 : undefined,
              left: corner.endsWith('left') ? -7 : undefined,
              right: corner.endsWith('right') ? -7 : undefined,
              cursor: corner === 'top-left' || corner === 'bottom-right' ? 'nwse-resize' : 'nesw-resize',
              touchAction: 'none',
            }}
            onPointerDown={startResize}
            onPointerMove={event => {
              if (!drag.current) return;
              const max = container.current?.clientWidth || 900;
              const delta = (event.clientX - drag.current.x) * drag.current.direction * (align === 'center' ? 2 : 1);
              updateAttributes({ width: `${Math.round(Math.min(max, Math.max(120, drag.current.width + delta)))}px` });
            }}
            onPointerUp={() => { drag.current = null; }}
            onPointerCancel={() => { drag.current = null; }}
            onLostPointerCapture={() => { drag.current = null; }}
          />
        ))}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => imageWidth(element.style.width || element.getAttribute('width')),
        renderHTML: attributes => ({ style: `width: ${imageWidth(attributes.width)}; height: auto;` }),
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => ({ 'data-align': attributes.align || 'center' }),
      },
    };
  },
  addNodeView() { return ReactNodeViewRenderer(ImageView); },
});
