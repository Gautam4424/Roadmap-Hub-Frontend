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

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Server error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export const api = {
  // Roadmaps
  getRoadmaps: () => fetchWithAuth('/roadmaps').then(res => res.json()),
  getCategories: () => fetchWithAuth('/categories').then(res => res.json()),
  getRoadmap: (slug: string) => fetchWithAuth(`/roadmaps/${slug}`).then(res => res.json()),
  importUserRoadmap: (data: any) => fetchWithAuth('/roadmaps/user-import', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  
  // Progress & Enrollment
  getProgress: (roadmapId: string) => fetchWithAuth(`/progress/${roadmapId}`).then(res => res.json()),
  getEnrolled: () => fetchWithAuth('/progress/enrolled').then(res => res.json()),
  enroll: (roadmapId: string) => fetchWithAuth(`/progress/${roadmapId}/enroll`, { method: 'POST' }).then(res => res.json()),
  isEnrolled: (roadmapId: string) => fetchWithAuth(`/progress/${roadmapId}/is-enrolled`).then(res => res.json()),
  
  getProgressStats: (roadmapId: string, subtopicIds: string[] = []) => 
    fetchWithAuth(`/progress/${roadmapId}/stats`, {
      method: 'POST',
      body: JSON.stringify({ subtopic_ids: subtopicIds.length > 0 ? subtopicIds : null })
    }).then(res => res.json()),
  seedTestData: (roadmapId: string) => fetchWithAuth(`/progress/${roadmapId}/seed-test`, { method: 'POST' }).then(res => res.json()),
  toggleProgress: (roadmapId: string, nodeId: string, completed: boolean) => 
    fetchWithAuth('/progress/toggle', {
      method: 'POST',
      body: JSON.stringify({ roadmap_id: roadmapId, node_id: nodeId, completed })
    }).then(res => res.json()),

  // Admin - Users
  getUsers: () => fetchWithAuth('/auth/admin/users').then(res => res.json()),
  toggleUserStatus: (userId: string, isActive: boolean) => 
    fetchWithAuth(`/auth/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive })
    }).then(res => res.json()),
  toggleUserRole: (userId: string, isAdmin: boolean) => 
    fetchWithAuth(`/auth/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ is_admin: isAdmin })
    }).then(res => res.json()),

  // Admin - Roadmaps
  createCategory: (data: any) => fetchWithAuth('/admin/categories', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  deleteCategory: (id: string) => fetchWithAuth(`/admin/categories/${id}`, { method: 'DELETE' }).then(res => res.json()),
  importRoadmapBulk: (data: any) => fetchWithAuth('/admin/roadmaps/import', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),

  createRoadmap: (data: any) => fetchWithAuth('/admin/roadmaps', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  createNode: (data: any) => fetchWithAuth('/admin/nodes', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  createResource: (data: any) => fetchWithAuth('/admin/resources', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  publishRoadmap: (slug: string, published: boolean) => fetchWithAuth('/admin/roadmaps/publish', { method: 'PATCH', body: JSON.stringify({ slug, published }) }).then(res => res.json()),

  // Custom Content (User Generated)
  getCustomNodes: (roadmapId: string) => fetchWithAuth(`/custom-content/fetch-by-roadmap/${roadmapId}`).then(res => res.json()),
  createCustomNode: (data: any) => fetchWithAuth('/custom-content/nodes', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  deleteCustomNode: (nodeId: string) => fetchWithAuth(`/custom-content/deallocate/node/${nodeId}`, { method: 'DELETE' }).then(res => res.ok ? true : false),
};
