"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

const MAX_NODES = 80;
const MAX_DEPTH = 4;

interface Node extends d3.SimulationNodeDatum {
  id: number;
  title: string;
  extract: string;
  thumbnail: string | null;
  url: string;
  depth: number;
  expanded: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: number | Node;
  target: number | Node;
}

let uid = -1;
const nextId = () => uid--;

export default function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Node | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState<number | null>(null);

  // Keep mutable refs for D3 to own
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const simRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const selectedRef = useRef<Node | null>(null);
  selectedRef.current = selected;

  const redraw = useCallback(() => {
    if (!containerRef.current) return;
    const svg = d3.select(containerRef.current).select<SVGSVGElement>("svg");

    // Edges
    const link = svg
      .select(".links")
      .selectAll<SVGLineElement, Link>("line")
      .data(linksRef.current, (_d, i) => String(i))
      .join("line")
      .attr("stroke", "#252525")
      .attr("stroke-width", 1);

    // Nodes
    const node = svg
      .select(".nodes")
      .selectAll<SVGGElement, Node>("g")
      .data(nodesRef.current, (d) => String(d.id))
      .join((enter) => {
        const g = enter.append("g").style("cursor", "pointer");

        g.append("circle")
          .attr("r", (d) => (d.depth === 0 ? 18 : d.depth === 1 ? 12 : 8))
          .attr("fill", (d) => (d.depth === 0 ? "#fff" : "#1a1a1a"))
          .attr("stroke", (d) => (d.depth === 0 ? "none" : "#555"))
          .attr("stroke-width", 1.5);

        g.append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", (d) => (d.depth === 0 ? 11 : 9))
          .attr("fill", (d) => (d.depth === 0 ? "#fff" : "#555"))
          .attr("y", (d) => (d.depth === 0 ? 18 : d.depth === 1 ? 12 : 8) + 14)
          .style("pointer-events", "none")
          .style("user-select", "none")
          .text((d) => (d.title.length > 22 ? d.title.slice(0, 22) + "…" : d.title));

        g.on("click", (_event, d) => {
          setSelected((prev) => (prev?.id === d.id ? null : { ...d }));
        });

        g.on("dblclick", (_event, d) => {
          expandNode(d);
        });

        // Drag
        g.call(
          d3
            .drag<SVGGElement, Node>()
            .on("start", (event, d) => {
              if (!event.active) simRef.current?.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event, d) => {
              if (!event.active) simRef.current?.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            }),
        );

        return g;
      });

    // Update circle fill/stroke for expanded state
    node
      .select("circle")
      .attr("fill", (d) => (d.depth === 0 ? "#fff" : d.expanded ? "#333" : "#1a1a1a"))
      .attr("stroke", (d) => (d.depth === 0 ? "none" : d.expanded ? "#888" : "#555"));

    // Tick
    simRef.current?.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x ?? 0)
        .attr("y1", (d) => (d.source as Node).y ?? 0)
        .attr("x2", (d) => (d.target as Node).x ?? 0)
        .attr("y2", (d) => (d.target as Node).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });
  }, []);

  const expandNode = useCallback(
    async (node: Node) => {
      if (node.expanded || node.depth >= MAX_DEPTH || nodesRef.current.length >= MAX_NODES) return;
      if (expanding !== null) return;
      setExpanding(node.id);

      try {
        const res = await fetch(`/api/graph?title=${encodeURIComponent(node.title)}`);
        const data = await res.json();
        if (!data.links) return;

        const existingTitles = new Set(nodesRef.current.map((n) => n.title));
        const newLinks = (data.links as { title: string }[])
          .filter((l) => !existingTitles.has(l.title))
          .slice(0, Math.min(15, MAX_NODES - nodesRef.current.length));

        const newNodes: Node[] = newLinks.map((l, i) => {
          const angle = (2 * Math.PI * i) / Math.max(newLinks.length, 1);
          return {
            id: nextId(),
            title: l.title,
            extract: "",
            thumbnail: null,
            url: "",
            depth: node.depth + 1,
            expanded: false,
            x: (node.x ?? 0) + Math.cos(angle) * 90,
            y: (node.y ?? 0) + Math.sin(angle) * 90,
          };
        });

        const newLinks2: Link[] = newNodes.map((n) => ({ source: node.id, target: n.id }));

        // Cross edges
        const existingByTitle = new Map(nodesRef.current.map((n) => [n.title, n.id]));
        const newByTitle = new Map(newNodes.map((n) => [n.title, n.id]));
        const crossLinks: Link[] = [];
        for (const n of newNodes) {
          const eid = existingByTitle.get(n.title);
          if (eid !== undefined && eid !== node.id) crossLinks.push({ source: eid, target: n.id });
        }
        for (const e of nodesRef.current) {
          const nid = newByTitle.get(e.title);
          if (nid !== undefined) crossLinks.push({ source: e.id, target: nid });
        }

        // Mark expanded
        const expandedNode = nodesRef.current.find((n) => n.id === node.id);
        if (expandedNode) expandedNode.expanded = true;

        nodesRef.current = [...nodesRef.current, ...newNodes];
        linksRef.current = [...linksRef.current, ...newLinks2, ...crossLinks];

        simRef
          .current!.nodes(nodesRef.current)
          .force(
            "link",
            d3
              .forceLink<Node, Link>(linksRef.current)
              .id((d) => d.id)
              .distance(80)
              .strength(0.7),
          )
          .alpha(0.4)
          .restart();

        redraw();
        setNodeCount(nodesRef.current.length);
        setSelected((prev) => (prev?.id === node.id ? { ...prev, expanded: true } : prev));
      } finally {
        setExpanding(null);
      }
    },
    [expanding, redraw],
  );

  // Bootstrap
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const width = el.clientWidth || window.innerWidth;
    const height = el.clientHeight || window.innerHeight;
    const cx = width / 2;
    const cy = height / 2;

    // Build SVG
    const svg = d3.select(el).append("svg").attr("width", "100%").attr("height", "100%");

    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");

    // Zoom
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.15, 4])
        .on("zoom", (event) => {
          svg.select(".links").attr("transform", event.transform);
          svg.select(".nodes").attr("transform", event.transform);
        }),
    );

    // Sim
    const sim = d3
      .forceSimulation<Node>()
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(cx, cy))
      .force(
        "collision",
        d3.forceCollide<Node>().radius((d) => (d.depth === 0 ? 18 : d.depth === 1 ? 12 : 8) + 20),
      )
      .alphaDecay(0.02);

    simRef.current = sim;

    // Fetch root
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/graph");
        const data = await res.json();
        if (!data.node) return;

        const root: Node = { ...data.node, depth: 0, expanded: true, x: cx, y: cy };
        const leaves: Node[] = (data.links as { title: string }[]).map((l, i) => {
          const angle = (2 * Math.PI * i) / data.links.length;
          return {
            id: nextId(),
            title: l.title,
            extract: "",
            thumbnail: null,
            url: "",
            depth: 1,
            expanded: false,
            x: cx + Math.cos(angle) * 100,
            y: cy + Math.sin(angle) * 100,
          };
        });

        nodesRef.current = [root, ...leaves];
        linksRef.current = leaves.map((n) => ({ source: root.id, target: n.id }));

        sim
          .nodes(nodesRef.current)
          .force(
            "link",
            d3
              .forceLink<Node, Link>(linksRef.current)
              .id((d) => d.id)
              .distance(80)
              .strength(0.7),
          )
          .alpha(1)
          .restart();

        redraw();
        setNodeCount(nodesRef.current.length);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      sim.stop();
      d3.select(el).selectAll("*").remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[#080808]" style={{ bottom: "57px" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#444] font-mono text-sm animate-pulse">Building graph...</p>
        </div>
      )}

      <div className="absolute top-4 left-4 text-[#2a2a2a] font-mono text-xs pointer-events-none">
        {nodeCount}/{MAX_NODES} nodes
      </div>

      {!selected && !loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#2a2a2a] font-mono text-xs whitespace-nowrap pointer-events-none">
          tap to select · double-tap to expand
        </div>
      )}

      {selected && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-white font-serif text-lg leading-tight">{selected.title}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-[#555] hover:text-white transition-colors shrink-0 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selected.extract && (
            <p className="text-[#555] font-mono text-xs leading-relaxed mb-3 line-clamp-2">
              {selected.extract}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#555] hover:text-white transition-colors border border-[#222] hover:border-[#444] rounded-full px-3 py-1.5">
                Read ↗
              </a>
            )}
            {!selected.expanded && selected.depth < MAX_DEPTH && nodeCount < MAX_NODES && (
              <button
                onClick={() => expandNode(selected)}
                disabled={expanding !== null}
                className="text-xs font-mono text-white border border-[#444] hover:border-white rounded-full px-3 py-1.5 transition-colors disabled:opacity-40">
                {expanding === selected.id ? "Expanding…" : "Expand"}
              </button>
            )}
            {selected.expanded && <span className="text-xs font-mono text-[#333]">Expanded</span>}
            {!selected.expanded && selected.depth >= MAX_DEPTH && (
              <span className="text-xs font-mono text-[#333]">Max depth</span>
            )}
            {!selected.expanded && nodeCount >= MAX_NODES && (
              <span className="text-xs font-mono text-[#333]">Max nodes</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
