const GATEWAY_URL = 'http://localhost:8000/api/v1';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${GATEWAY_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized (redirect to login)
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}

export const api = {
  // Roadmaps
  getRoadmaps: () => fetchWithAuth('/roadmaps').then(res => res.json()),
  getRoadmap: (slug: string) => fetchWithAuth(`/roadmaps/${slug}`).then(res => res.json()),
  
  // Progress
  getProgress: (roadmapId: string) => fetchWithAuth(`/progress/${roadmapId}`).then(res => res.json()),
  toggleProgress: (roadmapId: string, nodeId: string, completed: boolean) => 
    fetchWithAuth('/progress/toggle', {
      method: 'POST',
      body: JSON.stringify({ roadmap_id: roadmapId, node_id: nodeId, completed })
    }).then(res => res.json()),

  // Custom Content
  getCustomNodes: (roadmapId: string) => fetchWithAuth(`/custom-content/${roadmapId}`).then(res => res.json()),
  addCustomNode: (data: { roadmap_id: string, parent_node_id?: string, title: string, description?: string }) =>
    fetchWithAuth('/custom-content/nodes', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()),
};
