import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

// Thuật toán tự động sắp xếp Sơ đồ (Tránh các nút đè lên nhau)
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Kích thước mặc định của mỗi khối
    const nodeWidth = 172;
    const nodeHeight = 36;

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // Tinh chỉnh lại style cho node trông giống Atheneum UI
        node.targetPosition = direction === 'TB' ? 'top' : 'left';
        node.sourcePosition = direction === 'TB' ? 'bottom' : 'right';
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
        node.style = {
            background: '#fff',
            border: '2px solid #3b82f6', // blue-500
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#1e293b', // slate-800
            padding: '10px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: 150,
            textAlign: 'center'
        };
    });

    return { nodes, edges };
};

export default function MindMapViewer({ data }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (data && data.nodes && data.edges) {
            // Tự động sắp xếp lại vị trí trước khi render
            const layouted = getLayoutedElements(data.nodes, data.edges, 'TB'); // 'TB' = Top to Bottom
            setNodes(layouted.nodes);
            setEdges(layouted.edges);
        }
    }, [data, setNodes, setEdges]);

    if (!data || !data.nodes || data.nodes.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-30 text-slate-400">
                <span className="material-symbols-outlined text-[60px] mb-2">schema</span>
                <p className="text-xs">Chưa có sơ đồ nào</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#cbd5e1" gap={16} />
                <Controls showInteractive={false} />
                <Panel position="top-right" className="bg-white/80 p-2 rounded-lg shadow-sm text-[10px] font-bold text-slate-500">
                    Kéo để di chuyển, cuộn để zoom
                </Panel>
            </ReactFlow>
        </div>
    );
}