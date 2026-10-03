const Graph = require('graphology');
const { betweenness, closeness, pagerank, degree, eigenvector } = require('graphology-metrics/centrality');
const { density } = require('graphology-metrics/graph/density');
const { connectedComponents } = require('graphology-components');

const g = new Graph({ type: 'undirected' });
g.addNode('A');
g.addNode('B');
g.addNode('C');
g.addEdge('A', 'B');
g.addEdge('B', 'C');

console.log('Nodes:', g.order, 'Edges:', g.size);
console.log('Degree:', degree(g));
console.log('Betweenness:', betweenness(g));
console.log('Closeness:', closeness(g));
console.log('Pagerank:', pagerank(g));
console.log('Density:', density(g));
console.log('Connected components:', connectedComponents(g));
