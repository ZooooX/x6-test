import { Graph, Model, Node } from '@antv/x6';
import { DagreLayout, CircularLayout } from '@antv/layout';
import './style.css';



const buildElements = (data: any): Model.FromJSONData => {
	const nodes = data.nodes.map((x: any) => getNode(x));
	const edges = data.links.map((x: any) => getEdge(x));

	return { nodes, edges };
}

const buildElements2 = (): Model.FromJSONData => {
	const data: Model.FromJSONData = {
		nodes: [],
		edges: [],
	}
	const edges = [
		['1', '2'],
		['2', '3'],
		['2', '4'],
		['4', '5'],
		['4', '6'],
		['4', '7'],
		['4', '8'],
		['5', '9'],
		['6', '10'],
		['7', '11'],
		['8', '12'],
	]

	for (let i = 1; i <= 12; i++) {
		data.nodes!.push({
			id: `${i}`,
			shape: 'circle',
			width: 32,
			height: 32,
			label: i,
			attrs: {
				body: {
					fill: '#5F95FF',
					stroke: 'transparent',
				},
				label: {
					fill: '#ffffff',
				},
			},
		})
	}

	edges.forEach((edge: any) => {
		data.edges!.push({
			source: edge[0],
			target: edge[1],
			attrs: {
				line: {
					stroke: '#A2B1C3',
					strokeWidth: 2,
				},
			},
		})
	})

	return data;
}

const getDagre = (data: any) => {
	const dagreLayout = new DagreLayout({
		type: 'dagre',
		rankdir: 'LR',
		ranksep: 35,
		nodesep: 15,
	})

	return dagreLayout.layout(data);

};

const getNode = (data: any) => {

	return {
		id: data.id,
		shape: 'html',
		width: 120,
		height: 50,
		html: () => {
			const wrap = document.createElement('div');
			wrap.id = `node-${data.id}`;
			wrap.style.display = 'flex'
			wrap.style.alignItems = 'center'
			wrap.style.justifyContent = 'center'
			wrap.style.border = '2px solid #9254de'
			wrap.style.background = '#efdbff'
			wrap.style.borderRadius = '4px'
			wrap.innerText = data.id;

			const childrenContainer = document.createElement("div");
			const openButton = document.createElement("button");

			openButton.innerHTML = "CLICK ME";

			const childList = document.createElement("ul");

			if (data?.hierarchyDown?.length) {
				for (let x of data.hierarchyDown) {
					const child = document.createElement("li");
					child.innerHTML = x.id;
					childList.appendChild(child);
				}
			}

			childrenContainer.appendChild(openButton)
			childrenContainer.appendChild(childList)
			wrap.appendChild(childrenContainer)

			return wrap
		}
	}
};




const getEdge = (data: any) => {
	return {
		shape: "edge",
		source: data.source,
		target: data.target,
		attrs: {
			line: {
				stroke: '#A2B1C3',
				strokeWidth: 2,
			},
		},
	}
};

const refreshNodeSizes = (graph: Graph) => {
	const nodes = graph.getNodes();
	nodes.forEach((n: Node) => {
		const nodeWrap = document.getElementById(`node-${n.id}`);

		const dimensions = nodeWrap?.getBoundingClientRect();
		if (dimensions) n.setSize({ width: dimensions.width, height: dimensions.height });
	});
}


const data: any = {
	nodes: [
		{
			id: "1",
			hierarchyDown: [
				{ id: "1 1" },
				{ id: "1 2" },
				{ id: "1 3" },
				{ id: "1 4" },
			]
		},
		{
			id: "2",
			hierarchyDown: [
				{ id: "2 1" },
				{ id: "2 2" },
				{ id: "2 3" }
			]
		},
		{
			id: "3",
			hierarchyDown: [
				{ id: "3 1" },
				{ id: "3 2" },
				{ id: "3 3" },
				{ id: "3 4" },
			]
		},
		{
			id: "4",
			hierarchyDown: [
				{ id: "4 1" },
				{ id: "4 2" },
				{ id: "4 3" },
				{ id: "4 4" },
			]
		},
		{
			id: "5",
			hierarchyDown: [
				{ id: "5 1" },
				{ id: "5 2" }
			]
		},
		{
			id: "6",
			hierarchyDown: [
				{ id: "6 1" }
			]
		},
		{
			id: "7",
			hierarchyDown: [
				{ id: "7 1" },
				{ id: "7 2" },
				{ id: "7 3" },
				{ id: "7 4" },
			]
		},
		{
			id: "8",
			hierarchyDown: [
				{ id: "8 1" }
			]
		}
	],
	links: [
		{ source: "1", target: "2" },
		{ source: "2", target: "3" },
		{ source: "2", target: "4" },
		{ source: "4", target: "5" },
		{ source: "3", target: "6" },
		{ source: "3", target: "7" },
		{ source: "7", target: "8" },
	]
};


const graph = new Graph({
	container: document.getElementById("app")!,
	grid: true,
	scroller: {
		enabled: true,
		pannable: true,
		pageVisible: true,
		pageBreak: false,
	},
	mousewheel: {
		enabled: true
	}
});


const elements = buildElements(data);
const model = getDagre(elements);
graph.fromJSON(model);

refreshNodeSizes(graph);