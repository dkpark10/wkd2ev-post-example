'use client';

import { useEffect, useRef } from 'react';

type TrackName = 
  '01-state' | 
  '02-component' |
  '03-nested_component' |
  '04-life-cycle';

async function loadTrack(trackName: TrackName) {
  switch (trackName) {
    case '01-state': {
      const { rootRender, Component } = await import('@/example/reona/01-state');
      return { rootRender, Component };
    }
    case '02-component': {
      const { rootRender, Component } = await import('@/example/reona/02-component');
      return { rootRender, Component };
    }
    case '03-nested_component': {
      const { rootRender, Component } = await import('@/example/reona/03-nested_component');
      return { rootRender, Component };
    }
    case '04-life-cycle': {
      const { rootRender, Component } = await import('@/example/reona/04-life-cycle');
      return { rootRender, Component };
    }
    default:
      throw new Error(`Unknown track: ${trackName}`);
  }
}

interface ReonaExampleProps {
  trackName: string;
}

export default function ReonaExample({ trackName }: ReonaExampleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const init = async () => {
      const { rootRender, Component } = await loadTrack(trackName as TrackName);

      if (rootRef.current) {
        rootRender(rootRef.current, Component.default);
      }
    };

    init();

    return () => {
      if (rootRef.current) {
        rootRef.current.innerHTML = '';
      }
    };
  }, [trackName]);

  return <div id="reona-root" ref={rootRef} />;
}
